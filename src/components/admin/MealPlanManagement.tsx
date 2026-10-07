import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { MealPlan } from '@/src/types';
import { NuedeStore } from '@/src/services/store';
import { useToast } from '@/src/components/ui/Toast';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import { MealPlanFormModal } from './MealPlanFormModal';

export const MealPlanManagement: React.FC = () => {
  const { showToast } = useToast();
  const [plans, setPlans] = useState<MealPlan[]>(() => NuedeStore.getMealPlans());
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<MealPlan | null>(null);

  const reloadPlans = () => {
    setPlans(NuedeStore.getMealPlans());
  };

  const handleToggleActive = (plan: MealPlan) => {
    const updated: MealPlan = {
      ...plan,
      isActive: !plan.isActive,
      updatedAt: new Date().toISOString(),
    };
    NuedeStore.saveMealPlan(updated);
    reloadPlans();
    showToast(
      updated.isActive
        ? `"${plan.name}" is now active on the public website`
        : `"${plan.name}" has been deactivated and hidden from public ordering`,
      updated.isActive ? 'success' : 'info'
    );
  };

  const handleCreateNew = () => {
    setSelectedPlanForEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: MealPlan) => {
    setSelectedPlanForEdit(plan);
    setIsModalOpen(true);
  };

  const filteredPlans = plans.filter((p) => {
    if (filter === 'active') return p.isActive;
    if (filter === 'inactive') return !p.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1A1A]">
            Meal Plan Catalog Management
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Configure subscription packages, meal counts, pricing, and availability without breaking historical orders.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleCreateNew}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Meal Plan
        </Button>
      </div>

      {/* Filter Tabs & Historical Notice */}
      <Card className="p-4 space-y-3 bg-white border border-[#E5E5E5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: `All Plans (${plans.length})` },
              { id: 'active', label: `Active (${plans.filter((p) => p.isActive).length})` },
              { id: 'inactive', label: `Inactive (${plans.filter((p) => !p.isActive).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#096E21] text-white shadow-xs font-semibold'
                    : 'bg-neutral-100 text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#666666] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#096E21]" />
            <span>Soft deactivation preserves historical order snapshots</span>
          </div>
        </div>
      </Card>

      {/* Meal Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`p-0 overflow-hidden flex flex-col justify-between border transition-all ${
              plan.isActive
                ? 'border-[#E5E5E5] hover:border-[#096E21]/50 bg-white'
                : 'border-neutral-200 bg-neutral-50/70 opacity-80'
            }`}
          >
            {/* Image & Status Tag */}
            <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
              <img
                src={plan.imageUrl}
                alt={plan.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs ${
                    plan.isActive
                      ? 'bg-[#096E21] text-white'
                      : 'bg-neutral-800 text-white'
                  }`}
                >
                  {plan.isActive ? 'Active on Website' : 'Deactivated / Hidden'}
                </span>
              </div>
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#096E21] text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                {plan.duration} {plan.durationUnit}
              </div>
            </div>

            {/* Plan Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#666666]">
                  <span className="font-semibold text-[#096E21]">
                    {plan.mealCount} Fresh Meals
                  </span>
                  <span>≈ ₦{Math.round(plan.price / plan.mealCount).toLocaleString()} / meal</span>
                </div>

                <h3 className="font-bold text-lg font-heading text-[#1A1A1A] leading-snug">
                  {plan.name}
                </h3>

                <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-1.5 py-2.5 border-y border-[#E5E5E5] text-xs">
                {plan.highlights.slice(0, 3).map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-neutral-700">
                    <Check className="w-3.5 h-3.5 text-[#096E21] shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>

              {/* Price and Actions */}
              <div className="pt-2 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-sans text-[#096E21]">
                    ₦{plan.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#666666]">
                    / {plan.duration} {plan.durationUnit}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E5E5E5]">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(plan)}
                    leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  >
                    Edit Plan
                  </Button>

                  <Button
                    size="sm"
                    variant={plan.isActive ? 'ghost' : 'outline'}
                    className={
                      plan.isActive
                        ? 'text-neutral-500 hover:text-rose-600'
                        : 'text-[#096E21] border-[#096E21]'
                    }
                    onClick={() => handleToggleActive(plan)}
                    leftIcon={plan.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  >
                    {plan.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal: Create or Edit Meal Plan */}
      <MealPlanFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planToEdit={selectedPlanForEdit}
        onSaved={() => reloadPlans()}
      />
    </div>
  );
};
