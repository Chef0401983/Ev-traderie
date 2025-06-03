import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StandardLayout from '@/components/layout/StandardLayout';
import { Car, MapPin, Euro, Zap, Shield, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Audi Electric Vehicles for Sale Ireland | e-tron, Q4 e-tron | EV-Trader',
  description: 'Browse premium Audi electric vehicles for sale in Ireland. Find Audi e-tron, Q4 e-tron, and e-tron GT models. SEAI grants available. Free listings.',
  keywords: [
    'Audi electric vehicles Ireland',
    'Audi e-tron for sale Ireland',
    'Audi Q4 e-tron Ireland',
    'Audi e-tron GT Ireland',
    'premium electric cars Ireland',
    'luxury EVs Ireland',
    'Audi EV dealers Ireland',
    'electric Audi Dublin Cork',
    'Audi electric car prices Ireland'
  ],
  openGraph: {
    title: 'Audi Electric Vehicles Ireland | Premium EVs | EV-Trader',
    description: 'Discover premium Audi electric vehicles in Ireland. e-tron, Q4 e-tron, e-tron GT. SEAI grants up to €5,000.',
    type: 'website',
    url: 'https://ev-trader.ie/vehicles/audi',
    images: [
      {
        url: '/audi-ev-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Audi Electric Vehicles Ireland',
      },
    ],
  },
  alternates: {
    canonical: 'https://ev-trader.ie/vehicles/audi',
  },
};

const audiModels = [
  {
    name: 'Audi e-tron',
    range: '436km',
    price: '€75,000 - €95,000',
    description: 'Luxury electric SUV with quattro all-wheel drive',
    features: ['402hp', '95kWh battery', 'Air suspension', 'Virtual cockpit']
  },
  {
    name: 'Audi Q4 e-tron',
    range: '520km',
    price: '€55,000 - €70,000',
    description: 'Compact luxury electric SUV for urban and family use',
    features: ['265hp', '82kWh battery', 'MMI touch', 'LED Matrix headlights']
  },
  {
    name: 'Audi e-tron GT',
    range: '488km',
    price: '€105,000 - €140,000',
    description: 'High-performance electric grand tourer',
    features: ['476hp', '93.4kWh battery', '0-100km/h in 4.1s', 'Air suspension']
  },
  {
    name: 'Audi Q8 e-tron',
    range: '582km',
    price: '€85,000 - €110,000',
    description: 'Updated flagship electric SUV with enhanced range',
    features: ['408hp', '114kWh battery', 'Digital OLED rear lights', 'Bang & Olufsen']
  }
];

const locations = [
  { name: 'Dublin', count: '12+' },
  { name: 'Cork', count: '8+' },
  { name: 'Galway', count: '5+' },
  { name: 'Limerick', count: '4+' },
  { name: 'Waterford', count: '3+' },
  { name: 'Kilkenny', count: '2+' }
];

export default function AudiPage() {
  return (
    <StandardLayout>
      <Container className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Audi Electric Vehicles for Sale in Ireland
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover premium Audi electric vehicles including the e-tron, Q4 e-tron, and e-tron GT. 
            Luxury meets sustainability with SEAI grants up to €5,000 available.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button size="lg" asChild>
              <Link href="/vehicles?make=audi">
                Browse All Audi EVs
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">
                Sell Your Audi EV
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Benefits */}
        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Euro className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">SEAI Grants Available</h3>
                <p className="text-gray-600">Up to €5,000 grant for new Audi EVs, €3,800 for used imports</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600">Luxury German engineering with advanced electric technology</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Charging</h3>
                <p className="text-gray-600">Up to 270kW charging speeds, 10-80% in 31 minutes</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Audi Models */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Audi Electric Models</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {audiModels.map((model) => (
              <Card key={model.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
                      <p className="text-gray-600 mb-2">{model.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Zap className="h-4 w-4 mr-1" />
                          {model.range} range
                        </span>
                        <span className="flex items-center">
                          <Euro className="h-4 w-4 mr-1" />
                          {model.price}
                        </span>
                      </div>
                    </div>
                    <Car className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {model.features.map((feature, index) => (
                        <span key={index} className="text-sm text-gray-600 flex items-center">
                          <Award className="h-3 w-3 mr-1 text-green-500" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/vehicles?make=audi&model=${model.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      View {model.name} Listings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Location-based Search */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Audi EVs by Location</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map((location) => (
              <Card key={location.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-gray-500">{location.count} listings</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                    <Link href={`/vehicles?make=audi&location=${location.name.toLowerCase()}`}>
                      Browse
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Audi EV Buying Guide */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">Audi Electric Vehicle Buying Guide</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Why Choose Audi Electric?</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Premium German engineering and build quality</li>
                    <li>• Advanced quattro all-wheel drive technology</li>
                    <li>• Luxurious interiors with cutting-edge technology</li>
                    <li>• Comprehensive charging network access</li>
                    <li>• Strong resale values in Irish market</li>
                    <li>• Excellent safety ratings and driver assistance</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Audi EV Ownership in Ireland</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• VRT exemption saves €8,000-€15,000</li>
                    <li>• Lower road tax (€120 annually)</li>
                    <li>• Access to bus lanes in Dublin and Cork</li>
                    <li>• Reduced toll charges on M50</li>
                    <li>• Growing network of Audi e-tron charging hubs</li>
                    <li>• Comprehensive warranty coverage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Electric with Audi?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our selection of premium Audi electric vehicles or list your own Audi EV for sale. 
            Join Ireland's leading EV marketplace today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/vehicles?make=audi">
                Browse Audi EVs
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">
                List Your Audi EV
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/faq">
                EV Buying FAQ
              </Link>
            </Button>
          </div>
        </section>

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Audi Electric Vehicles for Sale Ireland",
              "description": "Browse premium Audi electric vehicles for sale in Ireland including e-tron, Q4 e-tron, and e-tron GT models.",
              "url": "https://ev-trader.ie/vehicles/audi",
              "mainEntity": {
                "@type": "ItemList",
                "name": "Audi Electric Vehicle Models",
                "itemListElement": audiModels.map((model, index) => ({
                  "@type": "Product",
                  "position": index + 1,
                  "name": model.name,
                  "description": model.description,
                  "offers": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "EUR",
                    "lowPrice": model.price.split(' - ')[0].replace('€', '').replace(',', ''),
                    "highPrice": model.price.split(' - ')[1]?.replace('€', '').replace(',', '') || model.price.replace('€', '').replace(',', ''),
                    "availability": "https://schema.org/InStock"
                  }
                }))
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://ev-trader.ie"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Electric Vehicles",
                    "item": "https://ev-trader.ie/vehicles"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Audi Electric Vehicles",
                    "item": "https://ev-trader.ie/vehicles/audi"
                  }
                ]
              }
            })
          }}
        />
      </Container>
    </StandardLayout>
  );
}
