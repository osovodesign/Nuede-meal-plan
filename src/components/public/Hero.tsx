import React from 'react';
import { Button } from '@/src/components/ui/Button';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react';

interface HeroProps {
  onExplorePlans: () => void;
  onConfirmDelivery: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplorePlans,
  onConfirmDelivery,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FEF2A3]/30 via-white to-[#F7F7F7] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E5E5E5]">
      {/* Subtle organic background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#FEF2A3]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#096E21]/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Messaging */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#096E21]/20 shadow-xs text-xs font-semibold text-[#096E21]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7B16]" />
              <span>Clean Nutrition · Delivered Fresh Everyday</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.12] font-heading">
              Eat Wholesome Food,{' '}
              <span className="text-[#096E21]">Without The Stress.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#666666] leading-relaxed font-body max-w-2xl">
              Chef-crafted weekly and monthly meal subscriptions cooked with unrefined natural ingredients. No processed seasonings, no cooking fatigue — just delicious food delivered straight to your door.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Button
                size="lg"
                variant="primary"
                onClick={onExplorePlans}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-sm"
              >
                Choose Your Meal Plan
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={onConfirmDelivery}
                leftIcon={<CheckCircle2 className="w-4 h-4 text-[#096E21]" />}
              >
                Confirm Food Delivery
              </Button>
            </div>

            {/* Value Highlights */}
            <div className="pt-6 border-t border-[#E5E5E5] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#096E21]/10 text-[#096E21] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>100% Unrefined Oils</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#096E21]/10 text-[#096E21] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Zero Account Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#096E21]/10 text-[#096E21] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Unique Order Code Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: Culinary Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Featured Plate Card */}
              <div className="rounded-3xl overflow-hidden bg-white border border-[#E5E5E5] shadow-xl p-3.5">
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-neutral-100">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
                    alt="Fresh Nuede Healthy Bowl"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-bold text-[#096E21] flex items-center gap-1.5 shadow-xs">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-[#FF7B16]" />
                    <span>Daily Rotational Menu</span>
                  </div>
                </div>

                {/* Card Sub-Banner */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-[#1A1A1A] font-heading">
                        Weekly Healthy Balance
                      </h4>
                      <p className="text-xs text-[#666666]">
                        14 Fresh Meals (Breakfast + Lunch)
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#096E21] font-sans">
                        ₦35,000
                      </div>
                      <span className="text-[10px] text-[#666666] bg-[#FEF2A3] px-2 py-0.5 rounded font-medium">
                        7 Days
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-[#E5E5E5] flex items-center justify-between text-xs text-[#666666]">
                    <span>Doorstep Dispatch: 7:00 AM - 9:30 AM</span>
                    <span className="text-[#096E21] font-semibold">Lagos & Abuja</span>
                  </div>
                </div>
              </div>

              {/* Floating Verified Confirmation Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 border border-[#096E21]/20 shadow-lg hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#096E21] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A]">
                    Order Code: MP-48291
                  </div>
                  <div className="text-[11px] text-[#096E21] font-medium">
                    Verified Customer Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
