import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StandardLayout from '@/components/layout/StandardLayout';
import { Calendar, Clock, ArrowRight, Zap, DollarSign, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'EV News & Guides Ireland | Electric Vehicle Blog | EV-Trader',
  description: 'Latest electric vehicle news, buying guides, and market insights for Ireland. Expert advice on EVs, grants, charging, and the Irish electric car market.',
  keywords: [
    'electric vehicle news Ireland',
    'EV buying guide Ireland',
    'electric car grants Ireland',
    'EV charging Ireland',
    'Irish EV market',
    'electric vehicle advice',
    'SEAI grants',
    'EV ownership Ireland',
    'electric car tips Ireland'
  ],
  openGraph: {
    title: 'EV News & Guides Ireland | EV-Trader Blog',
    description: 'Latest electric vehicle news, buying guides, and market insights for Ireland.',
    type: 'website',
    url: 'https://ev-trader.ie/blog',
    images: [
      {
        url: '/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'EV-Trader Blog - Electric Vehicle News Ireland',
      },
    ],
  },
  alternates: {
    canonical: 'https://ev-trader.ie/blog',
  },
};

export default function BlogPage() {
  const featuredPosts = [
    {
      title: 'Complete Guide to SEAI Electric Vehicle Grants 2024',
      excerpt: 'Everything you need to know about SEAI grants for electric vehicles in Ireland. Up to €5,000 available for new and used EVs.',
      category: 'Grants & Incentives',
      readTime: '8 min read',
      publishDate: '2024-01-15',
      slug: 'seai-electric-vehicle-grants-2024',
      featured: true
    },
    {
      title: 'Best Electric Cars for Irish Families in 2024',
      excerpt: 'Our comprehensive review of the top family-friendly electric vehicles available in Ireland, from Tesla Model Y to BMW iX.',
      category: 'Buying Guides',
      readTime: '12 min read',
      publishDate: '2024-01-10',
      slug: 'best-electric-cars-irish-families-2024',
      featured: true
    },
    {
      title: 'Electric Vehicle Charging Network Ireland: Complete Map',
      excerpt: 'Find every public charging station in Ireland. Our complete guide to EV charging infrastructure across all 32 counties.',
      category: 'Charging',
      readTime: '6 min read',
      publishDate: '2024-01-08',
      slug: 'ev-charging-network-ireland-map',
      featured: true
    }
  ];

  const recentPosts = [
    {
      title: 'Tesla Model Y vs BMW iX: Irish Market Comparison',
      excerpt: 'Detailed comparison of two premium electric SUVs for Irish buyers.',
      category: 'Reviews',
      readTime: '10 min read',
      publishDate: '2024-01-12',
      slug: 'tesla-model-y-vs-bmw-ix-ireland'
    },
    {
      title: 'VRT Relief for Electric Vehicles: How Much Can You Save?',
      excerpt: 'Understanding Vehicle Registration Tax relief for EVs in Ireland.',
      category: 'Tax & Finance',
      readTime: '5 min read',
      publishDate: '2024-01-11',
      slug: 'vrt-relief-electric-vehicles-ireland'
    },
    {
      title: 'EV Maintenance Costs in Ireland: What to Expect',
      excerpt: 'Real-world maintenance costs for electric vehicles from Irish owners.',
      category: 'Ownership',
      readTime: '7 min read',
      publishDate: '2024-01-09',
      slug: 'ev-maintenance-costs-ireland'
    },
    {
      title: 'Home EV Charging Installation Guide for Ireland',
      excerpt: 'Step-by-step guide to installing home charging for your electric vehicle.',
      category: 'Charging',
      readTime: '9 min read',
      publishDate: '2024-01-07',
      slug: 'home-ev-charging-installation-ireland'
    },
    {
      title: 'Electric Vehicle Insurance in Ireland: Best Deals',
      excerpt: 'Compare EV insurance rates and find the best coverage for your electric car.',
      category: 'Insurance',
      readTime: '6 min read',
      publishDate: '2024-01-05',
      slug: 'electric-vehicle-insurance-ireland'
    },
    {
      title: 'Used Electric Car Buying Checklist for Ireland',
      excerpt: 'Essential checks when buying a second-hand electric vehicle in Ireland.',
      category: 'Buying Guides',
      readTime: '8 min read',
      publishDate: '2024-01-03',
      slug: 'used-electric-car-buying-checklist-ireland'
    }
  ];

  const categories = [
    { name: 'Buying Guides', count: 12, icon: <Zap className="h-5 w-5" /> },
    { name: 'Grants & Incentives', count: 8, icon: <DollarSign className="h-5 w-5" /> },
    { name: 'Charging', count: 10, icon: <MapPin className="h-5 w-5" /> },
    { name: 'Reviews', count: 15, icon: <Clock className="h-5 w-5" /> },
    { name: 'Market News', count: 6, icon: <Calendar className="h-5 w-5" /> },
    { name: 'Ownership', count: 9, icon: <Zap className="h-5 w-5" /> }
  ];

  return (
    <StandardLayout>
      <Container className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Electric Vehicle News & Guides for Ireland
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stay informed with the latest EV news, buying guides, grant information, and market insights 
            specifically for Irish electric vehicle enthusiasts and buyers.
          </p>
        </div>

        {/* Featured Posts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.slug} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Featured Image</span>
                  </div>
                  <Badge variant="secondary" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.publishDate).toLocaleDateString('en-IE')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <Card key={post.slug} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Image</span>
                      </div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">
                          {post.category}
                        </Badge>
                        <h3 className="text-lg font-semibold mb-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(post.publishDate).toLocaleDateString('en-IE')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <Link 
                      key={category.name}
                      href={`/blog/category/${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="outline">{category.count}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
                <p className="text-gray-600 mb-4">
                  Get the latest EV news, grants updates, and buying guides delivered to your inbox.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/newsletter">
                    Subscribe to Newsletter
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Popular Guides */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Popular Guides</h3>
                <div className="space-y-3">
                  <Link href="/blog/seai-electric-vehicle-grants-2024" className="block p-2 rounded hover:bg-gray-50">
                    <div className="text-sm font-medium">SEAI EV Grants Guide</div>
                    <div className="text-xs text-gray-500">Complete grant information</div>
                  </Link>
                  <Link href="/blog/best-electric-cars-irish-families-2024" className="block p-2 rounded hover:bg-gray-50">
                    <div className="text-sm font-medium">Best Family EVs</div>
                    <div className="text-xs text-gray-500">Top recommendations</div>
                  </Link>
                  <Link href="/blog/ev-charging-network-ireland-map" className="block p-2 rounded hover:bg-gray-50">
                    <div className="text-sm font-medium">Charging Network Map</div>
                    <div className="text-xs text-gray-500">All charging stations</div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </StandardLayout>
  );
}
