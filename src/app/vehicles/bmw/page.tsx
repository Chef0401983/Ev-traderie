import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StandardLayout from '@/components/layout/StandardLayout';
import { ArrowRight, Zap, Battery, Gauge, MapPin, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BMW Electric Cars for Sale Ireland | iX, i4, i3 | EV-Trader',
  description: 'Browse BMW electric vehicles for sale in Ireland. BMW iX, i4, i3 and more. Verified BMW dealers and private sellers. Premium German electric cars.',
  keywords: [
    'BMW electric Ireland',
    'BMW iX Ireland',
    'BMW i4 Ireland',
    'BMW i3 Ireland',
    'BMW EV Ireland',
    'BMW electric car Ireland',
    'BMW dealership Ireland',
    'BMW Dublin',
    'BMW Cork',
    'second hand BMW electric Ireland'
  ],
  openGraph: {
    title: 'BMW Electric Cars for Sale Ireland | EV-Trader',
    description: 'Browse BMW iX, i4, i3 and other BMW electric vehicles for sale in Ireland. Verified dealers and private sellers.',
    type: 'website',
    url: 'https://ev-trader.ie/vehicles/bmw',
    images: [
      {
        url: '/bmw-category-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BMW Electric Cars for Sale in Ireland',
      },
    ],
  },
  alternates: {
    canonical: 'https://ev-trader.ie/vehicles/bmw',
  },
};

export default function BMWPage() {
  const bmwModels = [
    {
      name: 'iX',
      description: 'Luxury electric SUV flagship',
      priceRange: '€85,000 - €120,000',
      range: '630 km',
      acceleration: '4.6s 0-100km/h',
      image: '/bmw-ix.jpg'
    },
    {
      name: 'i4',
      description: 'Electric gran coupé',
      priceRange: '€55,000 - €75,000',
      range: '590 km',
      acceleration: '5.7s 0-100km/h',
      image: '/bmw-i4.jpg'
    },
    {
      name: 'i3',
      description: 'Compact urban electric car',
      priceRange: '€25,000 - €40,000',
      range: '310 km',
      acceleration: '7.3s 0-100km/h',
      image: '/bmw-i3.jpg'
    },
    {
      name: 'iX3',
      description: 'Electric luxury SUV',
      priceRange: '€65,000 - €85,000',
      range: '460 km',
      acceleration: '6.8s 0-100km/h',
      image: '/bmw-ix3.jpg'
    }
  ];

  const bmwFeatures = [
    {
      icon: <Star className="h-8 w-8 text-blue-600" />,
      title: 'Premium Quality',
      description: 'German engineering and luxury craftsmanship'
    },
    {
      icon: <Zap className="h-8 w-8 text-green-600" />,
      title: 'Advanced Technology',
      description: 'iDrive system and intelligent connectivity'
    },
    {
      icon: <Battery className="h-8 w-8 text-purple-600" />,
      title: 'Efficient Performance',
      description: 'Optimized electric drivetrain for maximum range'
    }
  ];

  return (
    <StandardLayout>
      <Container className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            BMW Electric Cars for Sale in Ireland
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover BMW's premium electric vehicle range in Ireland. From the innovative i3 to the 
            flagship iX, find your perfect BMW electric car from authorized dealers and private sellers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/vehicles?make=BMW">
                Browse All BMW EVs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/vehicles/create">
                Sell Your BMW
              </Link>
            </Button>
          </div>
        </div>

        {/* BMW Models Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">BMW Electric Models</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bmwModels.map((model) => (
              <Card key={model.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500">BMW {model.name}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">BMW {model.name}</h3>
                  <p className="text-gray-600 mb-3">{model.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price Range:</span>
                      <span className="font-medium">{model.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Range:</span>
                      <span className="font-medium">{model.range}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">0-100km/h:</span>
                      <span className="font-medium">{model.acceleration}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link href={`/vehicles?make=BMW&model=${model.name}`}>
                      View {model.name} Listings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose BMW Electric */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose BMW Electric?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {bmwFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Location-Based BMW Sales */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">BMW Electric Cars by Location</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kilkenny', 'Wexford', 'Donegal'].map((location) => (
              <Card key={location} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">BMW {location}</h3>
                      <Link 
                        href={`/vehicles?make=BMW&location=${location}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View listings →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* BMW Electric Buying Guide */}
        <section className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">BMW Electric Car Buying Guide</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">BMW Electric Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• BMW iDrive infotainment system</li>
                <li>• Adaptive regenerative braking</li>
                <li>• BMW ConnectedDrive services</li>
                <li>• Heat pump for efficient heating</li>
                <li>• BMW Charging network access</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Ownership Benefits</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• SEAI grants up to €5,000</li>
                <li>• BMW warranty and service support</li>
                <li>• Access to BMW charging network</li>
                <li>• Premium resale value</li>
                <li>• Comprehensive insurance options</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BMW Dealerships in Ireland */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Authorized BMW Dealers in Ireland</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">BMW Dublin</h3>
                <p className="text-gray-600 mb-4">Authorized BMW dealer serving Dublin and surrounding areas</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/vehicles?make=BMW&dealer_type=authorized&location=Dublin">
                    View Inventory
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">BMW Cork</h3>
                <p className="text-gray-600 mb-4">Premium BMW electric vehicles in Cork region</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/vehicles?make=BMW&dealer_type=authorized&location=Cork">
                    View Inventory
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">BMW Galway</h3>
                <p className="text-gray-600 mb-4">Serving the west of Ireland with BMW excellence</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/vehicles?make=BMW&dealer_type=authorized&location=Galway">
                    View Inventory
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Perfect BMW Electric</h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the ultimate driving machine in electric form
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/vehicles?make=BMW">
                Browse BMW EVs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-up">
                Create Account
              </Link>
            </Button>
          </div>
        </section>
      </Container>
    </StandardLayout>
  );
}
