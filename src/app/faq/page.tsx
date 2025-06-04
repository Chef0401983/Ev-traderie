'use client';

import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StandardLayout from '@/components/layout/StandardLayout';
import { ChevronDown, ChevronUp, HelpCircle, Zap, DollarSign, MapPin, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // SEAI Grants & Incentives
  {
    category: 'SEAI Grants & Incentives',
    question: 'How much SEAI grant can I get for an electric vehicle in Ireland?',
    answer: 'You can receive up to €5,000 SEAI grant for a new electric vehicle and up to €3,800 for a used electric vehicle (imported or second-hand). The exact amount depends on the vehicle\'s list price and CO2 emissions. Battery Electric Vehicles (BEVs) qualify for the full grant amount.'
  },
  {
    category: 'SEAI Grants & Incentives',
    question: 'Am I eligible for the SEAI electric vehicle grant?',
    answer: 'To be eligible, you must be an Irish resident, the vehicle must be for personal use, and it must be your first time claiming the grant for that specific vehicle. The vehicle must also meet SEAI\'s technical requirements and be purchased from an approved dealer.'
  },
  {
    category: 'SEAI Grants & Incentives',
    question: 'What is VRT relief for electric vehicles?',
    answer: 'Electric vehicles are exempt from Vehicle Registration Tax (VRT) in Ireland, which can save you thousands of euros. This applies to both new and used electric vehicles. The VRT relief is automatic when you register your EV.'
  },
  
  // Buying & Selling
  {
    category: 'Buying & Selling',
    question: 'What should I check when buying a used electric vehicle?',
    answer: 'Key things to check include: battery health and capacity, charging history, service records, software updates, warranty status, and any accident history. Also verify the vehicle\'s range capability and inspect charging ports for damage.'
  },
  {
    category: 'Buying & Selling',
    question: 'How do I sell my electric vehicle on EV-Trader?',
    answer: 'Create a free account, upload high-quality photos, provide detailed vehicle information including battery capacity and range, set a competitive price based on market research, and respond promptly to inquiries. Our platform connects you with serious EV buyers across Ireland.'
  },
  {
    category: 'Buying & Selling',
    question: 'What documents do I need to buy an electric vehicle in Ireland?',
    answer: 'You\'ll need: valid driving license, proof of insurance, PPS number, proof of address, and financing approval if applicable. For importing used EVs, you\'ll also need the vehicle\'s registration documents and compliance certificates.'
  },

  // Charging
  {
    category: 'Charging',
    question: 'Where can I charge my electric vehicle in Ireland?',
    answer: 'Ireland has over 1,200 public charging points including ESB ecars, IONITY, Tesla Superchargers, and independent operators. You can charge at home with a dedicated home charger, at work, shopping centers, hotels, and along major routes. Use apps like ESB ecars or PlugShare to find charging stations.'
  },
  {
    category: 'Charging',
    question: 'How much does it cost to charge an electric vehicle in Ireland?',
    answer: 'Home charging costs approximately €0.20-0.25 per kWh (night rate), making a full charge cost €10-20 depending on battery size. Public charging varies from €0.25-0.50 per kWh. Fast charging is more expensive but convenient for long trips.'
  },
  {
    category: 'Charging',
    question: 'Can I install a home charger for my electric vehicle?',
    answer: 'Yes, you can install a home charger with SEAI grant support up to €600. Installation must be done by an approved electrician. Most homes can accommodate a 7kW charger, which fully charges most EVs overnight.'
  },

  // Insurance & Finance
  {
    category: 'Insurance & Finance',
    question: 'Is electric vehicle insurance more expensive in Ireland?',
    answer: 'EV insurance can be slightly higher due to higher vehicle values and specialized repair costs, but many insurers offer discounts for electric vehicles. Shop around with insurers like AXA, Allianz, and FBD who have specific EV policies.'
  },
  {
    category: 'Insurance & Finance',
    question: 'Can I get financing for an electric vehicle in Ireland?',
    answer: 'Yes, most banks and credit unions offer EV financing. Some provide preferential rates for electric vehicles. Options include hire purchase, personal contract plans (PCP), and personal loans. The SEAI grant can be used as a deposit.'
  },

  // Ownership & Maintenance
  {
    category: 'Ownership & Maintenance',
    question: 'How much does electric vehicle maintenance cost in Ireland?',
    answer: 'EVs typically cost 30-50% less to maintain than petrol/diesel cars. No oil changes, fewer moving parts, and regenerative braking reduces brake wear. Annual service costs range from €200-500 depending on the vehicle and dealer.'
  },
  {
    category: 'Ownership & Maintenance',
    question: 'How long do electric vehicle batteries last?',
    answer: 'Most EV batteries are warranted for 8 years or 160,000km and typically retain 70-80% capacity after this period. Real-world data shows many batteries lasting well beyond warranty periods with proper care and charging habits.'
  },
  {
    category: 'Ownership & Maintenance',
    question: 'What is the range of electric vehicles available in Ireland?',
    answer: 'Modern EVs offer ranges from 250km to over 600km on a single charge. Popular models like Tesla Model 3 (491km), BMW iX (630km), and Volkswagen ID.4 (520km) provide excellent range for Irish driving conditions.'
  }
];

const categories = [
  { name: 'SEAI Grants & Incentives', icon: <DollarSign className="h-5 w-5" />, color: 'text-green-600' },
  { name: 'Buying & Selling', icon: <Zap className="h-5 w-5" />, color: 'text-blue-600' },
  { name: 'Charging', icon: <MapPin className="h-5 w-5" />, color: 'text-purple-600' },
  { name: 'Insurance & Finance', icon: <Shield className="h-5 w-5" />, color: 'text-orange-600' },
  { name: 'Ownership & Maintenance', icon: <HelpCircle className="h-5 w-5" />, color: 'text-red-600' }
];

function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <button
              onClick={() => toggleItem(index)}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                {openItems.has(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </div>
            </button>
            {openItems.has(index) && (
              <div className="px-6 pb-6">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FAQPage() {
  return (
    <StandardLayout>
      <Container className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Electric Vehicle FAQ for Ireland
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get answers to the most common questions about buying, selling, and owning 
            electric vehicles in Ireland. From SEAI grants to charging networks.
          </p>
        </div>

        {/* Quick Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={category.color}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        {faqData.filter(faq => faq.category === category.name).length} questions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Sections */}
        {categories.map((category) => {
          const categoryFAQs = faqData.filter(faq => faq.category === category.name);
          return (
            <section key={category.name} className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className={category.color}>
                  {category.icon}
                </div>
                <h2 className="text-3xl font-bold">{category.name}</h2>
              </div>
              <FAQAccordion faqs={categoryFAQs} />
            </section>
          );
        })}

        {/* Contact Section */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our team of EV experts is here to help 
            with any questions about electric vehicles in Ireland.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">
                Contact Our Experts
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/blog">
                Read Our Blog
              </Link>
            </Button>
          </div>
        </section>

        {/* Schema Markup for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqData.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      </Container>
    </StandardLayout>
  );
}
