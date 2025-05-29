import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail, sendVerificationSubmittedEmail } from '@/lib/email/helpers';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create service role client to bypass RLS policies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await request.json();
    const {
      verificationType,
      photoIdUrl,
      photoIdType,
      proofOfAddressUrl,
      proofOfAddressType,
      businessRegistrationUrl,
      businessRegistrationNumber,
      businessName,
      businessAddress,
      vatNumber
    } = body;

    // Validate required fields
    if (!verificationType || !photoIdUrl || !photoIdType || !proofOfAddressUrl || !proofOfAddressType) {
      return NextResponse.json({ 
        error: 'Missing required verification documents' 
      }, { status: 400 });
    }

    // Additional validation for dealership verification
    if (verificationType === 'dealership') {
      if (!businessRegistrationUrl || !businessRegistrationNumber || !businessName || !businessAddress) {
        return NextResponse.json({ 
          error: 'Missing required business documents for dealership verification' 
        }, { status: 400 });
      }
    }

    // Check if user already has a verification record
    const { data: existingVerification } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Ensure user profile exists (in case webhook failed)
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id, email, full_name')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      // Create profile if it doesn't exist (fallback for webhook failures)
      try {
        const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        });

        if (clerkResponse.ok) {
          const clerkUser = await clerkResponse.json();
          const email = clerkUser.email_addresses?.[0]?.email_address || '';
          const firstName = clerkUser.first_name || '';
          const lastName = clerkUser.last_name || '';
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: userId,
              email: email,
              full_name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
              user_type: verificationType === 'dealership' ? 'dealership' : 'individual',
              verification_status: 'pending',
              can_create_listings: false,
              is_admin: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (!insertError) {
            console.log('Profile created successfully for user:', userId);
          } else {
            console.error('Failed to create profile:', insertError);
          }
        } else {
          console.error('Failed to fetch user from Clerk:', await clerkResponse.text());
        }
      } catch (fetchError) {
        console.error('Error fetching user from Clerk:', fetchError);
      }
    }

    const verificationData = {
      user_id: userId,
      verification_type: verificationType,
      photo_id_url: photoIdUrl,
      photo_id_type: photoIdType,
      proof_of_address_url: proofOfAddressUrl,
      proof_of_address_type: proofOfAddressType,
      status: 'submitted',
      ...(verificationType === 'dealership' && {
        business_registration_url: businessRegistrationUrl,
        business_registration_number: businessRegistrationNumber,
        business_name: businessName,
        business_address: businessAddress,
        vat_number: vatNumber
      })
    };

    let result;
    if (existingVerification) {
      // Update existing verification
      result = await supabase
        .from('user_verifications')
        .update(verificationData)
        .eq('user_id', userId)
        .select()
        .single();
    } else {
      // Create new verification
      result = await supabase
        .from('user_verifications')
        .insert(verificationData)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json({ 
        error: 'Failed to submit verification documents' 
      }, { status: 500 });
    }

    // Send welcome email if this is a new verification submission
    if (!existingVerification) {
      try {
        const userProfile = profile || await supabase
          .from('profiles')
          .select('email, full_name, user_type')
          .eq('user_id', userId)
          .single()
          .then(res => res.data);

        if (userProfile?.email) {
          const userName = userProfile.full_name || userProfile.email.split('@')[0];
          const userType = (userProfile as any).user_type || verificationType === 'dealership' ? 'dealership' : 'individual';
          await sendWelcomeEmail(userProfile.email, userName, userType);
          console.log('Welcome email sent to:', userProfile.email);
        }
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the verification if email fails
      }
    }

    // Send verification submitted email for all submissions (new or updated)
    try {
      const userProfile = profile || await supabase
        .from('profiles')
        .select('email, full_name, user_type')
        .eq('user_id', userId)
        .single()
        .then(res => res.data);

      if (userProfile?.email) {
        const userName = userProfile.full_name || userProfile.email.split('@')[0];
        const userType = (userProfile as any).user_type || (verificationType === 'dealership' ? 'dealership' : 'individual');
        await sendVerificationSubmittedEmail(userProfile.email, userName, userType);
        console.log('Verification submitted email sent to:', userProfile.email);
      }
    } catch (emailError) {
      console.error('Failed to send verification submitted email:', emailError);
      // Don't fail the verification if email fails
    }

    return NextResponse.json({ 
      message: 'Verification documents submitted successfully',
      verification: result.data 
    });

  } catch (error) {
    console.error('Verification submission error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
