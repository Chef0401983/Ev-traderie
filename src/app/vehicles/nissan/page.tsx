import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StandardLayout from '@/components/layout/StandardLayout';
import { Car, MapPin, Euro, Zap, Leaf, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nissan Electric Vehicles for Sale Ireland | LEAF, Ariya | EV-Trader',
  description: 'Find affordable Nissan electric vehicles for sale in Ireland. Browse LEAF, Ariya models. SEAI grants available. Ireland\'s most popular EV brand.',
  keywords: [
    'Nissan electric vehicles Ireland',
    'Nissan LEAF for sale Ireland',
    'Nissan Ariya Ireland',
    'affordable electric cars Ireland',
    'family EVs Ireland',
    'Nissan EV dealers Ireland',
    'electric Nissan Dublin Cork',
    'Nissan LEAF prices Ireland',
    'used Nissan LEAF Ireland'
  ],
  openGraph: {
    title: 'Nissan Electric Vehicles Ireland | LEAF & Ariya | EV-Trader',
    description: 'Browse affordable Nissan electric vehicles in Ireland. LEAF and Ariya models with SEAI grants up to €5,000.',
    type: 'website',
    url: 'https://ev-trader.ie/vehicles/nissan',
    images: [
      {
        url: '/nissan-ev-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Nissan Electric Vehicles Ireland',
      },
    ],
  },
  alternates: {
    canonical: 'https://ev-trader.ie/vehicles/nissan',
  },
};

const nissanModels = [
  {
    name: 'Nissan LEAF',
    range: '385km',
    price: '€32,000 - €42,000',
    description: 'Ireland\'s most popular electric car - reliable, affordable, practical',
    features: ['160hp', '62kWh battery', 'ProPILOT Assist', 'e-Pedal driving']
  },
  {
    name: 'Nissan LEAF e+',
    range: '385km',
    price: '€38,000 - €45,000',
    description: 'Enhanced LEAF with more power and advanced features',
    features: ['217hp', '62kWh battery', 'Bose audio', 'Intelligent mobility']
  },
  {
    name: 'Nissan Ariya',
    range: '520km',
    price: '€55,000 - €70,000',
    description: 'Premium electric crossover with cutting-edge technology',
    features: ['242hp', '87kWh battery', 'e-4ORCE AWD', '22" alloys available']
  },
  {
    name: 'Nissan Townstar EV',
    range: '285km',
    price: '€35,000 - €40,000',
    description: 'Compact electric van perfect for business and family use',
    features: ['122hp', '45kWh battery', '800kg payload', 'Sliding doors']
  }
];

const locations = [
  { name: 'Dublin', count: '25+' },
  { name: 'Cork', count: '18+' },
  { name: 'Galway', count: '12+' },
  { name: 'Limerick', count: '8+' },
  { name: 'Waterford', count: '6+' },
  { name: 'Drogheda', count: '5+' }
];

export default function NissanPage() {
  return (
    <StandardLayout>
      <Container className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Nissan Electric Vehicles for Sale in Ireland
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Browse Ireland's most popular electric vehicles from Nissan. Find reliable LEAF and 
            innovative Ariya models with SEAI grants up to €5,000 available.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button size="lg" asChild>
              <Link href="/vehicles?make=nissan">
                Browse All Nissan EVs
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">
                Sell Your Nissan EV
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
                <h3 className="text-xl font-semibold mb-2">Most Affordable EVs</h3>
                <p className="text-gray-600">Starting from €32,000 with SEAI grants reducing costs further</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ireland's #1 EV</h3>
                <p className="text-gray-600">Most popular electric car in Ireland with proven reliability</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Leaf className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pioneer Technology</h3>
                <p className="text-gray-600">Over 10 years of EV innovation and development</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Nissan Models */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Nissan Electric Models</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {nissanModels.map((model) => (
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
                          <Leaf className="h-3 w-3 mr-1 text-green-500" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/vehicles?make=nissan&model=${model.name.toLowerCase().replace(/\s+/g, '-')}`}>
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
          <h2 className="text-3xl font-bold text-center mb-8">Nissan EVs by Location</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map((location) => (
              <Card key={location.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-gray-500">{location.count} listings</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                    <Link href={`/vehicles?make=nissan&location=${location.name.toLowerCase()}`}>
                      Browse
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose Nissan LEAF */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Why Nissan LEAF is Ireland's Favorite EV</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Euro className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Best Value</h3>
                  <p className="text-gray-700">Most affordable new EV in Ireland with excellent running costs</p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Proven Reliability</h3>
                  <p className="text-gray-700">Over 500,000 LEAFs sold worldwide with excellent track record</p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Perfect for Ireland</h3>
                  <p className="text-gray-700">385km range ideal for Irish driving with growing charging network</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Nissan EV Buying Guide */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">Nissan Electric Vehicle Buying Guide</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Benefits of Nissan EVs</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Most affordable electric vehicles in Ireland</li>
                    <li>• Proven reliability with 10+ years of EV experience</li>
                    <li>• Excellent dealer network across Ireland</li>
                    <li>• Strong resale values and market acceptance</li>
                    <li>• User-friendly technology and driving experience</li>
                    <li>• Comprehensive warranty and support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Nissan EV Ownership Costs</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• SEAI grant up to €5,000 for new vehicles</li>
                    <li>• VRT exemption saves €3,000-€8,000</li>
                    <li>• Annual road tax only €120</li>
                    <li>• Home charging costs €8-12 per full charge</li>
                    <li>• Minimal maintenance requirements</li>
                    <li>• Access to bus lanes and reduced tolls</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Used LEAF Section */}
        <section className="mb-12">
          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">Used Nissan LEAF - Great Value Option</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Why Buy a Used LEAF?</h3>
                  <ul className="space-y-2 text-gray-700 mb-6">
                    <li>• Prices starting from €15,000 for older models</li>
                    <li>• €3,800 SEAI grant available for used imports</li>
                    <li>• Battery degradation typically minimal</li>
                    <li>• Large selection available in Irish market</li>
                    <li>• Perfect first EV for many families</li>
                  </ul>
                  <Button asChild>
                    <Link href="/vehicles?make=nissan&condition=used">
                      Browse Used Nissan LEAFs
                    </Link>
                  </Button>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">What to Check When Buying Used:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Battery health indicator (aim for 10+ bars)</li>
                    <li>• Service history and maintenance records</li>
                    <li>• Charging cable and equipment included</li>
                    <li>• Software updates completed</li>
                    <li>• Physical condition of charging port</li>
                    <li>• Warranty status and remaining coverage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the EV Revolution?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our extensive selection of Nissan electric vehicles or list your own Nissan EV for sale. 
            Start your electric journey with Ireland's most trusted EV brand.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/vehicles?make=nissan">
                Browse Nissan EVs
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">
                List Your Nissan EV
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
              "name": "Nissan Electric Vehicles for Sale Ireland",
              "description": "Browse affordable Nissan electric vehicles for sale in Ireland including LEAF and Ariya models.",
              "url": "https://ev-trader.ie/vehicles/nissan",
              "mainEntity": {
                "@type": "ItemList",
                "name": "Nissan Electric Vehicle Models",
                "itemListElement": nissanModels.map((model, index) => ({
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
                    "name": "Nissan Electric Vehicles",
                    "item": "https://ev-trader.ie/vehicles/nissan"
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
