import React, { useState } from 'react';
import { MealPlan } from '@/src/types';
import { MealPlanCard } from './MealPlanCard';
import { NuedeStore } from '@/src/services/store';

interface MealPlanCatalogProps {
  onSelectPlan: (plan: MealPlan) => void;
  onViewPlanDetails: (plan: MealPlan) => void;
}

export const MealPlanCatalog: React.FC<MealPlanCatalogProps> = ({
  onSelectPlan,
  onViewPlanDetails,
}) => {
  const [filter, setFilter] = useState<'all' | 'weekly' | 'monthly' | 'executive'>('all');
  const allPlans = NuedeStore.getActiveMealPlans();

  const filteredPlans = allPlans.filter((plan) => {
    if (filter === 'weekly') return plan.duration === 7;
    if (filter === 'monthly') return plan.duration === 30;
    if (filter === 'executive') return plan.price >= 50000;
    return true;
  });

  return (
    <section id="meal-plans-catalog" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FEF2A3] text-[#096E21] text-xs font-semibold tracking-wide">
            Chef-Prepared Daily Menus
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] font-heading">
            Choose Your Ideal Meal Plan
          </h2>
          <p className="text-sm sm:text-base text-[#666666] font-body">
            All plans include daily morning delivery, insulated thermal packaging, and rotational breakfast & lunch menus.
          </p>

          {/* Interactive filter tabs (adhering to frontend design constitution: functional buttons, clean segmented control) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Meal Plans' },
              { id: 'weekly', label: 'Weekly Plans (7 Days)' },
              { id: 'monthly', label: 'Monthly Subscriptions' },
              { id: 'executive', label: 'Executive Gourmet' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#096E21] text-white shadow-xs font-semibold'
                    : 'bg-neutral-100 text-[#666666] hover:text-[#1A1A1A] hover:bg-neutral-200/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredPlans.map((plan, index) => (
            <MealPlanCard
              key={plan.id}
              plan={plan}
              featured={index === 0}
              onSelect={onSelectPlan}
              onViewDetails={onViewPlanDetails}
            />
          ))}
        </div>

        {/* Footnote on transparent pricing & delivery */}
        <div className="p-6 rounded-2xl bg-[#FEF2A3]/30 border border-[#FEF2A3] text-center max-w-3xl mx-auto space-y-2">
          <h4 className="text-sm font-bold text-[#096E21] font-heading">
            Transparent Pricing With No Hidden Fees
          </h4>
          <p className="text-xs text-[#666666] leading-relaxed">
            All prices reflect freshly cooked food with real ingredients. A flat ₦2,000 doorstep delivery fee applies per subscription to cover dedicated insulated morning dispatch across Lagos & Abuja.
          </p>
        </div>
      </div>
    </section>
  );
};
