import React from 'react';
import { Utensils, MapPin, CreditCard, Truck, CheckSquare } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Select Your Plan',
      description:
        'Choose a weekly or monthly subscription that matches your lifestyle and dietary goals.',
      icon: <Utensils className="w-5 h-5 text-[#096E21]" />,
    },
    {
      step: '02',
      title: 'Provide Delivery Info',
      description:
        'Enter your phone number, delivery address, and delivery instructions. No account or password required.',
      icon: <MapPin className="w-5 h-5 text-[#096E21]" />,
    },
    {
      step: '03',
      title: 'Pay Securely Online',
      description:
        'Complete payment seamlessly. The server verifies your transaction and generates your unique order code.',
      icon: <CreditCard className="w-5 h-5 text-[#096E21]" />,
    },
    {
      step: '04',
      title: 'Receive Food Daily',
      description:
        'Our dedicated dispatch riders deliver freshly cooked meals in thermal containers between 7:00 AM – 9:30 AM.',
      icon: <Truck className="w-5 h-5 text-[#096E21]" />,
    },
    {
      step: '05',
      title: 'Confirm with Order Code',
      description:
        'Input your order code on our confirmation page and tap "I Received My Food" for immediate verification.',
      icon: <CheckSquare className="w-5 h-5 text-[#096E21]" />,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FEF2A3] text-[#096E21] text-xs font-semibold tracking-wide">
            Seamless Ordering
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] font-heading">
            How Nuede Works
          </h2>
          <p className="text-sm sm:text-base text-[#666666] font-body">
            From chef preparation to your doorstep delivery confirmation in five simple, transparent steps.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative rounded-2xl p-6 bg-[#F7F7F7] border border-[#E5E5E5] flex flex-col justify-between space-y-4 hover:border-[#096E21]/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center shadow-xs">
                  {item.icon}
                </div>
                <span className="text-2xl font-bold text-[#096E21]/25 font-heading">
                  {item.step}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-[#1A1A1A] font-heading">
                  {item.title}
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed font-body">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
