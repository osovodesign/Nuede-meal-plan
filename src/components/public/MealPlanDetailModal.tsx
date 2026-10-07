import React from 'react';
import { MealPlan } from '@/src/types';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import {
  Check,
  Clock,
  Utensils,
  Truck,
  Leaf,
  ShieldCheck,
  Calendar,
  ArrowRight,
} from 'lucide-react';

interface MealPlanDetailModalProps {
  plan: MealPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plan: MealPlan) => void;
}

export const MealPlanDetailModal: React.FC<MealPlanDetailModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!plan) return null;

  const sampleMenu = [
    { day: 'Day 1', breakfast: 'Spiced Sweet Potato Mash & Poached Eggs', lunch: 'Grilled Herb Chicken Bowl with Quinoa & Steamed Greens' },
    { day: 'Day 2', breakfast: 'Chia Seed Coconut Parfait & Fresh Mango Compote', lunch: 'Pan-Seared Salmon with Lemon Asparagus & Brown Rice' },
    { day: 'Day 3', breakfast: 'Spinach & Smoked Turkey Frittata', lunch: 'Slow-Cooked Beef Pottage with Plantain & Steamed Broccoli' },
    { day: 'Day 4', breakfast: 'Avocado & Herb Toast with Crumbled Goat Cheese', lunch: 'Zesty Lemon Pepper White Fish with Cauliflower Mash' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="space-y-6">
        {/* Header with image */}
        <div className="relative -mx-6 -mt-6 h-56 bg-neutral-100 overflow-hidden">
          <img
            src={plan.imageUrl}
            alt={plan.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
            <div className="text-white space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider bg-[#096E21] px-2.5 py-1 rounded text-white inline-block">
                {plan.duration} {plan.durationUnit} Subscription
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                {plan.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Quick specs bar */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-[#FEF2A3]/30 border border-[#FEF2A3] rounded-xl text-center">
          <div>
            <div className="text-xs text-[#666666]">Total Meals</div>
            <div className="text-base font-bold text-[#096E21] font-heading">
              {plan.mealCount} Meals
            </div>
          </div>
          <div className="border-x border-[#E5E5E5]">
            <div className="text-xs text-[#666666]">Per Meal Cost</div>
            <div className="text-base font-bold text-[#096E21] font-heading">
              ₦{Math.round(plan.price / plan.mealCount).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#666666]">Dispatch Window</div>
            <div className="text-base font-bold text-[#096E21] font-heading">
              7:00 - 9:30 AM
            </div>
          </div>
        </div>

        {/* Full description */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
            About This Plan
          </h4>
          <p className="text-sm text-[#666666] leading-relaxed font-body">
            {plan.description}
          </p>
        </div>

        {/* Highlights */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
            Plan Highlights & Standards
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {plan.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-50 border border-[#E5E5E5] text-xs text-[#1A1A1A]"
              >
                <div className="w-4 h-4 rounded-full bg-[#096E21]/15 text-[#096E21] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Daily Menu */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#096E21]" />
            <span>Sample Menu Rotation (First 4 Days)</span>
          </h4>
          <div className="space-y-2">
            {sampleMenu.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-[#E5E5E5] bg-white text-xs space-y-1"
              >
                <span className="font-bold text-[#096E21] uppercase tracking-wide">
                  {m.day}
                </span>
                <div className="text-[#1A1A1A]">
                  <strong className="text-[#666666]">Breakfast:</strong> {m.breakfast}
                </div>
                <div className="text-[#1A1A1A]">
                  <strong className="text-[#666666]">Lunch:</strong> {m.lunch}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Packaging Notice */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] text-xs text-[#666666] space-y-2">
          <div className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
            <Truck className="w-4 h-4 text-[#096E21]" />
            <span>Doorstep Delivery & Confirmation</span>
          </div>
          <p>
            Delivered in insulated, tamper-evident thermal boxes every weekday morning. After receiving your food, simply visit the <span className="font-semibold text-[#096E21]">Confirm Delivery</span> page and enter your unique order code.
          </p>
        </div>

        {/* Bottom checkout bar */}
        <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#666666] block">Total Amount</span>
            <span className="text-2xl font-bold text-[#096E21] font-sans">
              ₦{plan.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              Back to Plans
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onSelect(plan);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Select This Plan
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
