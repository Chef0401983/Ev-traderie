import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ev-trader.ie';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/vehicles`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vehicles/tesla`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vehicles/bmw`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vehicles/audi`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vehicles/nissan`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ];
  
  // Check if we have the required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase environment variables not found, generating static sitemap only');
    return staticPages;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all active vehicle listings with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Supabase query timeout')), 5000)
    );
    
    const vehicleQuery = supabase
      .from('vehicles')
      .select('id, updated_at, is_sold')
      .eq('is_sold', false)
      .order('updated_at', { ascending: false })
      .limit(1000); // Limit to prevent excessive URLs
    
    const { data: vehicles } = await Promise.race([
      vehicleQuery,
      timeoutPromise
    ]) as any;

    const vehiclePages = vehicles?.map((vehicle: any) => ({
      url: `${baseUrl}/vehicles/${vehicle.id}`,
      lastModified: new Date(vehicle.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || [];

    // Get popular search terms for category pages
    const categoryPages = [
      'tesla',
      'bmw',
      'audi',
      'volkswagen',
      'nissan',
      'hyundai',
      'mercedes',
      'dublin',
      'cork',
      'galway',
      'limerick',
      'waterford',
    ].map((category) => ({
      url: `${baseUrl}/vehicles?search=${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...vehiclePages, ...categoryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
