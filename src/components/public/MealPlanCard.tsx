import React from 'react';
import { MealPlan } from '@/src/types';
import { Button } from '@/src/components/ui/Button';
import { Check, Clock, Utensils, ArrowRight } from 'lucide-react';

interface MealPlanCardProps {
  plan: MealPlan;
  onSelect: (plan: MealPlan) => void;
  onViewDetails: (plan: MealPlan) => void;
  featured?: boolean;
}

export const MealPlanCard: React.FC<MealPlanCardProps> = ({
  plan,
  onSelect,
  onViewDetails,
  featured = false,
}) => {
  return (
    <div
      className={`group relative rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        featured
          ? 'border-[#096E21] ring-1 ring-[#096E21]/20'
          : 'border-[#E5E5E5] hover:border-[#096E21]/50'
      }`}
    >
      {/* Top Banner if featured */}
      {featured && (
        <div className="bg-[#FEF2A3] text-[#096E21] text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 text-center border-b border-amber-200">
          Most Popular Choice
        </div>
      )}

      {/* Plan Image */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
        <img
          src={plan.imageUrl}
          alt={plan.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#096E21] font-bold text-xs px-2.5 py-1 rounded-md shadow-xs border border-neutral-200/50">
          {plan.duration} {plan.durationUnit}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-[#666666] font-medium">
            <span className="flex items-center gap-1 text-[#096E21] font-semibold">
              <Utensils className="w-3.5 h-3.5" />
              {plan.mealCount} Fresh Meals
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Daily Morning Delivery
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#1A1A1A] font-heading leading-tight group-hover:text-[#096E21] transition-colors">
            {plan.name}
          </h3>

          <p className="text-xs text-[#666666] leading-relaxed font-body line-clamp-2">
            {plan.description}
          </p>
        </div>

        {/* Highlights List */}
        <div className="space-y-2 py-3 border-y border-[#E5E5E5]/70">
          {plan.highlights.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#1A1A1A]">
              <div className="w-4 h-4 rounded-full bg-[#096E21]/10 text-[#096E21] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="leading-tight">{item}</span>
            </div>
          ))}
        </div>

        {/* Price & Action CTA */}
        <div className="space-y-3 pt-1">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-[#096E21] font-sans">
                ₦{plan.price.toLocaleString()}
              </span>
              <span className="text-xs text-[#666666] ml-1">
                / {plan.duration} {plan.durationUnit}
              </span>
            </div>
            <span className="text-[11px] text-[#666666]">
              ≈ ₦{Math.round(plan.price / plan.mealCount).toLocaleString()} / meal
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails(plan)}
            >
              Plan Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSelect(plan)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Choose Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
