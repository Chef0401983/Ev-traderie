export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    
    const { userId } = await auth();
    
    if (!userId) {
      console.log('Upload failed: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('User authenticated:', userId);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'verification-documents';
    const path = formData.get('path') as string;

    console.log('File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      bucket
    });

    if (!file) {
      console.log('Upload failed: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Upload failed: Invalid file type:', file.type);
      return NextResponse.json({ 
        error: 'Invalid file type. Only images (JPEG, PNG, WebP) and PDF files are allowed.' 
      }, { status: 400 });
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      console.log('Upload failed: File too large:', file.size);
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    // Use service role client for bucket operations (admin permissions)
    const adminSupabase = createServiceRoleClient();
    // Use regular client for file uploads (user permissions)
    const supabase = createServerClient();

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = path || `${userId}/${timestamp}.${fileExtension}`;

    console.log('Generated filename:', fileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('File converted to buffer, size:', buffer.length);

    // Skip bucket creation since buckets already exist
    // Just attempt to upload directly to the existing bucket
    console.log('Uploading to existing bucket:', bucket);

    // Upload to Supabase Storage (using service role client to bypass RLS)
    const { data, error } = await adminSupabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ 
        error: `Failed to upload file: ${error.message}` 
      }, { status: 500 });
    }

    console.log('File uploaded successfully:', data);

    // For verification documents, create signed URL instead of public URL for security
    let fileUrl;
    if (bucket === 'verification-documents') {
      // Create signed URL that expires in 24 hours for verification documents
      const { data: signedUrlData, error: signedUrlError } = await adminSupabase.storage
        .from(bucket)
        .createSignedUrl(fileName, 86400); // 24 hours

      if (signedUrlError) {
        console.error('Failed to create signed URL:', signedUrlError);
        return NextResponse.json({ 
          error: `Failed to create secure URL: ${signedUrlError.message}` 
        }, { status: 500 });
      }

      fileUrl = signedUrlData.signedUrl;
      console.log('Signed URL created for verification document:', fileUrl);
    } else {
      // For vehicle images, use public URL (these can be public)
      const { data: { publicUrl } } = adminSupabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      fileUrl = publicUrl;
      console.log('Public URL generated for vehicle image:', fileUrl);
    }

    return NextResponse.json({ 
      url: fileUrl,
      path: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}

