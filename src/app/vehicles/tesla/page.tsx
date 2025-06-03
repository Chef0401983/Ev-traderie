import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StandardLayout from '@/components/layout/StandardLayout';
import { ArrowRight, Zap, Battery, Gauge, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tesla Electric Cars for Sale Ireland | EV-Trader',
  description: 'Browse Tesla Model 3, Model Y, Model S & Model X for sale in Ireland. Verified Tesla dealers and private sellers. Best prices on Irish Tesla marketplace.',
  keywords: [
    'Tesla Ireland',
    'Tesla for sale Ireland',
    'Tesla Model 3 Ireland',
    'Tesla Model Y Ireland',
    'Tesla Model S Ireland',
    'Tesla Model X Ireland',
    'buy Tesla Ireland',
    'Tesla dealership Ireland',
    'Tesla Dublin',
    'Tesla Cork',
    'second hand Tesla Ireland'
  ],
  openGraph: {
    title: 'Tesla Electric Cars for Sale Ireland | EV-Trader',
    description: 'Browse Tesla Model 3, Model Y, Model S & Model X for sale in Ireland. Verified dealers and private sellers.',
    type: 'website',
    url: 'https://ev-trader.ie/vehicles/tesla',
    images: [
      {
        url: '/tesla-category-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Tesla Electric Cars for Sale in Ireland',
      },
    ],
  },
  alternates: {
    canonical: 'https://ev-trader.ie/vehicles/tesla',
  },
};

export default function TeslaPage() {
  const teslaModels = [
    {
      name: 'Model 3',
      description: 'Premium sedan with autopilot',
      priceRange: '€35,000 - €55,000',
      range: '491 km',
      acceleration: '5.6s 0-100km/h',
      image: '/tesla-model-3.jpg'
    },
    {
      name: 'Model Y',
      description: 'Compact luxury SUV',
      priceRange: '€45,000 - €65,000',
      range: '533 km',
      acceleration: '5.0s 0-100km/h',
      image: '/tesla-model-y.jpg'
    },
    {
      name: 'Model S',
      description: 'Luxury performance sedan',
      priceRange: '€85,000 - €120,000',
      range: '634 km',
      acceleration: '3.2s 0-100km/h',
      image: '/tesla-model-s.jpg'
    },
    {
      name: 'Model X',
      description: 'Luxury SUV with falcon doors',
      priceRange: '€95,000 - €130,000',
      range: '560 km',
      acceleration: '3.9s 0-100km/h',
      image: '/tesla-model-x.jpg'
    }
  ];

  const whyChooseTesla = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: 'Supercharger Network',
      description: 'Access to Ireland\'s most extensive fast-charging network'
    },
    {
      icon: <Battery className="h-8 w-8 text-green-600" />,
      title: 'Long Range',
      description: 'Up to 634km range on a single charge'
    },
    {
      icon: <Gauge className="h-8 w-8 text-red-600" />,
      title: 'Performance',
      description: 'Instant torque and incredible acceleration'
    }
  ];

  return (
    <StandardLayout>
      <Container className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Tesla Electric Cars for Sale in Ireland
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover Ireland's largest selection of Tesla vehicles. From Model 3 to Model X, 
            find your perfect Tesla from verified dealers and private sellers across Ireland.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/vehicles?make=Tesla">
                Browse All Tesla <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/vehicles/create">
                Sell Your Tesla
              </Link>
            </Button>
          </div>
        </div>

        {/* Tesla Models Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tesla Models Available</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teslaModels.map((model) => (
              <Card key={model.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Tesla {model.name}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tesla {model.name}</h3>
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
                    <Link href={`/vehicles?make=Tesla&model=${model.name.replace(' ', '+')}`}>
                      View {model.name} Listings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose Tesla Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Tesla in Ireland?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseTesla.map((feature, index) => (
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

        {/* Location-Based Tesla Sales */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tesla Sales by Location</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kilkenny', 'Wexford', 'Donegal'].map((location) => (
              <Card key={location} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Tesla {location}</h3>
                      <Link 
                        href={`/vehicles?make=Tesla&location=${location}`}
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

        {/* Tesla Buying Guide */}
        <section className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tesla Buying Guide for Ireland</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">What to Look For</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Battery health and warranty status</li>
                <li>• Software version and autopilot features</li>
                <li>• Charging history and supercharger usage</li>
                <li>• Service records and maintenance history</li>
                <li>• Paint and interior condition</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Tesla Ownership in Ireland</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• SEAI grants up to €5,000 available</li>
                <li>• VRT relief for electric vehicles</li>
                <li>• Free parking in many Irish cities</li>
                <li>• Growing supercharger network</li>
                <li>• Lower running costs vs petrol/diesel</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Tesla?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied Tesla owners across Ireland
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/vehicles?make=Tesla">
                Browse Tesla Listings <ArrowRight className="ml-2 h-4 w-4" />
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
