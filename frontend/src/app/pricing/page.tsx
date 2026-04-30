import React from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Basic',
      price: '$15',
      description: 'Perfect for casual readers who want ad-free summaries.',
      features: [
        'Full Daily Digest Access',
        'Source Attribution',
        'Ad-Free Experience',
        'AI Summarization (Basic Models)',
        '3 Category Subscriptions'
      ],
      cta: 'Start Reading',
      popular: false
    },
    {
      name: 'Pro',
      price: '$30',
      description: 'For professionals needing deep geopolitical analysis.',
      features: [
        'Everything in Basic',
        'Premium LLM Analysis (Claude/GPT-4)',
        'Advanced Geopolitical Insights',
        'Full Category Access',
        'Downloadable PDF Briefings',
        'Early Access to Deep Dives'
      ],
      cta: 'Get Pro Access',
      popular: true
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-gutter py-24 bg-slate-50/30">
      <div className="max-w-5xl mx-auto text-center mb-20">
        <h1 className="font-display-lg text-indigo-950 mb-6 tracking-tight">Invest in Deep Knowledge</h1>
        <p className="font-body-xl text-slate-500 max-w-2xl mx-auto">
          No ads. No misinformation. Just fact-checked, source-attributed current affairs powered by state-of-the-art AI.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {tiers.map((tier) => (
          <div 
            key={tier.name} 
            className={`flex flex-col p-8 lg:p-12 rounded-[40px] bg-white border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
              tier.popular ? 'border-primary shadow-xl ring-2 ring-primary/20 relative' : 'border-slate-100 shadow-sm'
            }`}
          >
            {tier.popular && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white font-label-sm px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                Recommended
              </span>
            )}
            
            <div className="mb-10 text-center">
              <h3 className="font-headline-md text-indigo-950 mb-4">{tier.name}</h3>
              <div className="flex items-end justify-center gap-1 mb-4">
                <span className="font-display-lg text-indigo-950">{tier.price}</span>
                <span className="font-body-lg text-slate-400 mb-2">/ month</span>
              </div>
              <p className="font-body-md text-slate-500 leading-relaxed">
                {tier.description}
              </p>
            </div>

            <ul className="space-y-4 mb-12 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-600 font-body-md">
                  <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link 
              href="/account"
              className={`w-full py-4 rounded-2xl font-label-md text-center transition-all shadow-md ${
                tier.popular 
                  ? 'bg-primary text-white hover:bg-primary-dark' 
                  : 'bg-indigo-950 text-white hover:bg-indigo-900'
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <p className="font-label-sm text-slate-400 uppercase tracking-widest mb-4">Trusted by over 10,000+ Aspirants</p>
        <div className="flex justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          {/* Logo Placeholders */}
          <span className="material-symbols-outlined text-[48px]">school</span>
          <span className="material-symbols-outlined text-[48px]">account_balance</span>
          <span className="material-symbols-outlined text-[48px]">business_center</span>
          <span className="material-symbols-outlined text-[48px]">biotech</span>
        </div>
      </div>
    </div>
  );
}
