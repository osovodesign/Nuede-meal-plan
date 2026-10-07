import React, { useState, useEffect } from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { MealPlan } from '@/src/types';
import { NuedeStore } from '@/src/services/store';
import { useToast } from '@/src/components/ui/Toast';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface MealPlanFormModalProps {
  planToEdit: MealPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const MealPlanFormModal: React.FC<MealPlanFormModalProps> = ({
  planToEdit,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(35000);
  const [duration, setDuration] = useState<number>(7);
  const [durationUnit, setDurationUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [mealCount, setMealCount] = useState<number>(14);
  const [imageUrl, setImageUrl] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (planToEdit) {
      setName(planToEdit.name);
      setSlug(planToEdit.slug);
      setDescription(planToEdit.description);
      setPrice(planToEdit.price);
      setDuration(planToEdit.duration);
      setDurationUnit(planToEdit.durationUnit);
      setMealCount(planToEdit.mealCount);
      setImageUrl(planToEdit.imageUrl || '');
      setHighlights(planToEdit.highlights.length ? planToEdit.highlights : ['']);
      setIsActive(planToEdit.isActive);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setPrice(35000);
      setDuration(7);
      setDurationUnit('days');
      setMealCount(14);
      setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
      setHighlights(['14 Chef-prepared fresh meals', 'Daily morning delivery', 'Portion-controlled']);
      setIsActive(true);
    }
  }, [planToEdit, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!planToEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleHighlightChange = (index: number, val: string) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };

  const addHighlightField = () => {
    setHighlights([...highlights, '']);
  };

  const removeHighlightField = (index: number) => {
    if (highlights.length <= 1) return;
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Plan name is required', 'error');
      return;
    }
    if (price <= 0) {
      showToast('Price must be greater than 0', 'error');
      return;
    }

    const cleanHighlights = highlights.map((h) => h.trim()).filter(Boolean);

    const planData: MealPlan = {
      id: planToEdit ? planToEdit.id : `mp_${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || `plan-${Date.now()}`,
      description: description.trim(),
      price: Number(price),
      currency: 'NGN',
      duration: Number(duration),
      durationUnit,
      mealCount: Number(mealCount),
      imageUrl:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      highlights: cleanHighlights,
      isActive,
      createdAt: planToEdit ? planToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    NuedeStore.saveMealPlan(planData);
    showToast(
      planToEdit
        ? `Meal Plan "${planData.name}" updated!`
        : `New Meal Plan "${planData.name}" created!`,
      'success'
    );
    onSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={planToEdit ? `Edit Meal Plan: ${planToEdit.name}` : 'Create New Meal Plan'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-xs text-[#666666] -mt-2">
          Configure subscription packages, meal counts, pricing, and availability. Prices update only for new orders; historical order snapshots remain preserved.
        </p>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Plan Name"
            placeholder="e.g. Keto Power & Lean Protein"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
          <Input
            label="Public URL Slug"
            placeholder="keto-power-lean-protein"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
            Plan Description
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2 text-xs text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#096E21]"
            placeholder="Nutritious chef-curated bowls packed with fresh vegetables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Pricing & Units */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input
            label="Price (₦ NGN)"
            type="number"
            min={1000}
            step={500}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />

          <Input
            label="Duration"
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />

          <Select
            label="Duration Unit"
            value={durationUnit}
            onChange={(e) => setDurationUnit(e.target.value as any)}
            options={[
              { value: 'days', label: 'Days' },
              { value: 'weeks', label: 'Weeks' },
              { value: 'months', label: 'Months' },
            ]}
          />

          <Input
            label="Total Meals"
            type="number"
            min={1}
            value={mealCount}
            onChange={(e) => setMealCount(Number(e.target.value))}
            required
          />
        </div>

        {/* Image URL & Preset selector */}
        <div className="space-y-2">
          <Input
            label="Cover Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
          <div className="flex items-center gap-2 text-[11px] text-[#666666]">
            <span>Presets:</span>
            {[
              {
                label: 'Salad & Greens',
                url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
              },
              {
                label: 'Salmon & Asparagus',
                url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
              },
              {
                label: 'Grain Bowl',
                url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
              },
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(p.url)}
                className="text-[#096E21] hover:underline cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              Key Highlights & Inclusions
            </span>
            <button
              type="button"
              onClick={addHighlightField}
              className="text-xs font-semibold text-[#096E21] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Highlight</span>
            </button>
          </div>

          <div className="space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#096E21]"
                  placeholder="e.g. Free cold-pressed herbal booster drink"
                  value={h}
                  onChange={(e) => handleHighlightChange(i, e.target.value)}
                />
                {highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHighlightField(i)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 rounded"
                    title="Remove highlight"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Toggle (Soft deactivation) */}
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-[#E5E5E5] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#1A1A1A] block">
              Active For Public Website Orders
            </span>
            <span className="text-[#666666]">
              When inactive, the plan is hidden from customers but preserved for historical orders.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isActive ? 'bg-[#096E21]' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Submit Actions */}
        <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {planToEdit ? 'Save Changes' : 'Create Meal Plan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
