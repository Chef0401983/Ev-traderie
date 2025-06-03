import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images (
          id,
          image_url,
          is_primary
        ),
        profiles (
          full_name,
          user_type
        )
      `)
      .eq('id', id)
      .single();

    if (!vehicle) {
      return {
        title: 'Vehicle Not Found | EV-Trader Ireland',
        description: 'The requested electric vehicle listing could not be found.',
      };
    }

    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} - €${vehicle.price?.toLocaleString()} | EV-Trader Ireland`;
    const description = `Buy this ${vehicle.year} ${vehicle.make} ${vehicle.model} electric vehicle in ${vehicle.location}, Ireland. ${vehicle.mileage?.toLocaleString()} km, ${vehicle.battery_capacity}kWh battery. Trusted seller on EV-Trader.`;
    
    const primaryImage = vehicle.vehicle_images?.find((img: any) => img.is_primary) || vehicle.vehicle_images?.[0];
    const imageUrl = primaryImage?.image_url || '/default-car-image.jpg';

    return {
      title,
      description,
      keywords: [
        `${vehicle.make} ${vehicle.model}`,
        `${vehicle.year} ${vehicle.make}`,
        `electric car ${vehicle.location}`,
        `EV for sale Ireland`,
        `${vehicle.make} Ireland`,
        'electric vehicle',
        'EV marketplace',
        vehicle.location || 'Ireland'
      ],
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://ev-trader.ie/vehicles/${id}`,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          },
        ],
        siteName: 'EV-Trader Ireland',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://ev-trader.ie/vehicles/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Electric Vehicle | EV-Trader Ireland',
      description: 'View this electric vehicle listing on Ireland\'s premier EV marketplace.',
    };
  }
}

export default function VehicleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
