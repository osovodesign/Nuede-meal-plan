import React from 'react';
import { ShieldCheck, HeartPulse, Sparkles, Award, Clock, Leaf } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Cooked Daily, Never Frozen',
      description:
        'Every meal is prepared fresh in the early morning hours by certified culinary chefs and packed hot into insulated containers.',
      icon: <Clock className="w-5 h-5 text-[#096E21]" />,
    },
    {
      title: 'Real, Unprocessed Ingredients',
      description:
        'We cook exclusively with cold-pressed olive oil, unrefined sesame oil, natural spices, and zero synthetic MSG or additives.',
      icon: <Leaf className="w-5 h-5 text-[#096E21]" />,
    },
    {
      title: 'Portion & Macro-Balanced',
      description:
        'Engineered to keep you energetic and satiated throughout your workday without the post-lunch fatigue or sugar crashes.',
      icon: <HeartPulse className="w-5 h-5 text-[#096E21]" />,
    },
    {
      title: 'Guaranteed Delivery Accountability',
      description:
        'Every order has a verifiable unique order code. You confirm your meal receipt directly on our platform for 100% peace of mind.',
      icon: <ShieldCheck className="w-5 h-5 text-[#096E21]" />,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F7F7F7] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FEF2A3] text-[#096E21] text-xs font-semibold tracking-wide">
              The Nuede Standard
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] font-heading leading-tight">
              Culinary Excellence In Every Single Box
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed font-body">
              We started Nuede because busy people deserve to eat real, clean food without sacrificing their evenings to meal prep or relying on greasy takeout.
            </p>
            <div className="pt-2 p-5 rounded-2xl bg-white border border-[#E5E5E5] space-y-2">
              <div className="text-xs font-bold text-[#096E21] uppercase tracking-wider">
                Our Guarantee
              </div>
              <p className="text-xs text-[#1A1A1A] leading-relaxed">
                If your food arrives cold, late, or unsealed, our dispatch team will immediately replace your meal or credit your account. No questions asked.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {points.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs space-y-3 hover:border-[#096E21]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FEF2A3]/50 flex items-center justify-center">
                  {p.icon}
                </div>
                <h3 className="font-bold text-base text-[#1A1A1A] font-heading">
                  {p.title}
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed font-body">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
