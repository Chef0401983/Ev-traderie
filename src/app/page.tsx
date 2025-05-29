import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { Button, Container, Card, CardContent, Badge } from '@/components/ui';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { Vehicle } from '@/lib/models/vehicle';
import StandardLayout from '@/components/layout/StandardLayout';
import VideoHero from '@/components/VideoHero';
import ComingSoonPage from '@/components/ComingSoonPage';

// Fetch system settings from Supabase directly
async function getSystemSettings() {
  try {
    const supabase = createServerClient();
    
    // Get settings directly from Supabase
    const { data: settingsData, error } = await supabase
      .from('system_settings')
      .select('*')
      .in('key', ['coming_soon', 'hero_section']);
    
    if (error) {
      console.error('Failed to fetch system settings:', error);
      return getDefaultSettings();
    }
    
    // Transform to the expected format
    const settings = settingsData.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return getDefaultSettings();
  }
}

// Default settings if database fetch fails
function getDefaultSettings() {
  return {
    coming_soon: { enabled: false },
    hero_section: { 
      video_enabled: false,
      video_url: '',
      fallback_image: '/images/hero-background.jpg'
    }
  };
}

export default async function Home() {
  const featuredVehicles = await getFeaturedVehicles();
  const settings = await getSystemSettings();
  
  // Check if coming soon mode is enabled
  if (settings.coming_soon?.enabled) {
    return <ComingSoonPage settings={settings.coming_soon} />;
  }

  return (
    <StandardLayout>
      {/* Hero Section */}
      {settings.hero_section?.video_enabled ? (
        <VideoHero settings={settings.hero_section} />
      ) : (
        <section className="bg-gradient-primary">
        <Container className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight font-poppins">
                Drive the future
                  <span className="text-white/90 block">Trade electric</span>
                </h1>
                <p className="text-xl text-white/80 leading-relaxed font-lato">
                  Discover Ireland's premier marketplace for electric vehicles. 
                  Buy, sell, and explore the latest EVs with confidence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="secondary" size="lg" className="text-center bg-white text-primary hover:bg-gray-50">
                  <Link href="/vehicles">
                    Explore Vehicles
                  </Link>
                </Button>
                <SignedOut>
                  <Button asChild variant="outline" size="lg" className="text-center border-white text-white hover:bg-white hover:text-primary">
                    <Link href="/sign-up">
                      Sell my EV
                    </Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button asChild variant="outline" size="lg" className="text-center border-white text-white hover:bg-white hover:text-primary">
                    <Link href="/dashboard/individual/listings/new">
                      List Your EV
                    </Link>
                  </Button>
                </SignedIn>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">✓</Badge>
                  <span className="font-lato text-white/90">Verified Sellers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">🔒</Badge>
                  <span className="font-lato text-white/90">Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">🎯</Badge>
                  <span className="font-lato text-white/90">Expert Support</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-poppins">Electric Future</h3>
                  <p className="text-white/80 font-lato">Join the revolution</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* Featured Vehicles Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-poppins">
              Featured Vehicles
            </h2>
            <p className="text-xl text-gray-600 font-lato">
              Check out our latest and greatest electric vehicles
            </p>
          </div>

          {featuredVehicles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredVehicles.map((vehicle: Vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link href="/vehicles">
                  <Button size="lg" className="px-8">
                    View All Vehicles
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">No Featured Vehicles Yet</h3>
                <p className="text-gray-600 font-lato mb-6">
                  We're working on featuring some amazing electric vehicles. Check back soon!
                </p>
                <Link href="/vehicles">
                  <Button>Browse All Vehicles</Button>
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-poppins">
              Why Choose EV-Trader?
            </h2>
            <p className="text-xl text-gray-600 font-lato">
              Ireland's most trusted electric vehicle marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">Verified Sellers</h3>
                <p className="text-gray-600 font-lato">
                  All our sellers are verified for your peace of mind and security.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">Electric Only</h3>
                <p className="text-gray-600 font-lato">
                  Focused exclusively on electric vehicles for a cleaner future.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">Expert Support</h3>
                <p className="text-gray-600 font-lato">
                  Get help from our team of electric vehicle experts.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </StandardLayout>
  );
}

async function getFeaturedVehicles(): Promise<Vehicle[]> {
  try {
    // Check if we're in build mode without proper env vars
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase not configured, returning empty featured vehicles for build');
      return [];
    }

    const supabase = createServerClient();
    
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images (
          id,
          image_url,
          is_primary
        ),
        profiles (
          user_id,
          full_name,
          user_type
        )
      `)
      .eq('is_featured', true)
      .eq('is_sold', false)
      .limit(6);

    if (error) {
      console.error('Error fetching featured vehicles:', error);
      return [];
    }

    return vehicles || [];
  } catch (error) {
    console.error('Error in getFeaturedVehicles:', error);
    return [];
  }
}
