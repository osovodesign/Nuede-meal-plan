import React, { useState } from 'react';
import { MealPlan, CustomerAddress, OrderSource } from '@/src/types';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Select } from '@/src/components/ui/Select';
import { useToast } from '@/src/components/ui/Toast';
import {
  Utensils,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  Minus,
} from 'lucide-react';

interface CheckoutProps {
  plan: MealPlan | null;
  onBackToPlans: () => void;
  onProceedToPayment: (checkoutData: CheckoutFormData) => void;
}

export interface CheckoutFormData {
  plan: MealPlan;
  quantity: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: CustomerAddress;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
}

export const Checkout: React.FC<CheckoutProps> = ({
  plan,
  onBackToPlans,
  onProceedToPayment,
}) => {
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<'details' | 'summary'>('details');

  // Customer contact state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Delivery address state
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('Lekki Phase 1');
  const [state, setState] = useState('Lagos');
  const [landmark, setLandmark] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">
          No Meal Plan Selected
        </h2>
        <p className="text-sm text-[#666666]">
          Please browse our available meal plans and choose your preferred subscription before checking out.
        </p>
        <Button variant="primary" onClick={onBackToPlans}>
          Browse Meal Plans
        </Button>
      </div>
    );
  }

  // Financial calculations
  const unitPrice = plan.price;
  const subtotal = unitPrice * quantity;
  const deliveryFee = 2000;
  const totalAmount = subtotal + deliveryFee;

  const validateDetails = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required for delivery coordination';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Please provide a valid 10 or 11-digit phone number';
    }

    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!addressLine1.trim()) {
      newErrors.addressLine1 = 'Delivery street address is required';
    }
    if (!city.trim()) {
      newErrors.city = 'City or Area is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) {
      showToast('Please fill in the required fields correctly', 'error');
      return;
    }
    setCurrentStep('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    const checkoutData: CheckoutFormData = {
      plan,
      quantity,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: {
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        landmark: landmark.trim() || null,
        deliveryInstructions: deliveryInstructions.trim() || null,
      },
      subtotal,
      deliveryFee,
      totalAmount,
    };

    onProceedToPayment(checkoutData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {/* Header breadcrumb & step indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
        <div>
          <button
            type="button"
            onClick={onBackToPlans}
            className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#096E21] mb-2 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Meal Plan</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1A1A]">
            Complete Your Meal Subscription
          </h1>
          <p className="text-xs text-[#666666] mt-1 font-body">
            Zero account registration required. Fast, transparent checkout.
          </p>
        </div>

        {/* Step pills */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentStep === 'details'
                ? 'bg-[#096E21] text-white'
                : 'bg-neutral-100 text-[#666666]'
            }`}
          >
            <span>1</span>
            <span>Customer & Address</span>
          </div>
          <div className="text-neutral-300">/</div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentStep === 'summary'
                ? 'bg-[#096E21] text-white'
                : 'bg-neutral-100 text-[#666666]'
            }`}
          >
            <span>2</span>
            <span>Order Summary & Pay</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form or Summary */}
        <div className="lg:col-span-7 space-y-6">
          {currentStep === 'details' ? (
            <form onSubmit={handleContinueToSummary} className="space-y-6">
              {/* Customer Contact Section */}
              <Card className="space-y-5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#096E21] border-b border-[#E5E5E5] pb-3">
                  <User className="w-4 h-4" />
                  <span>1. Customer Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="e.g. Chidinma"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    placeholder="e.g. Nwachukwu"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={errors.lastName}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number (Required for Delivery)"
                    placeholder="e.g. 0803 123 4567"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                    helperText="Our riders call this number upon arrival"
                    required
                  />
                  <Input
                    label="Email Address (Optional)"
                    placeholder="e.g. customer@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    helperText="For order code receipt backup"
                  />
                </div>
              </Card>

              {/* Delivery Address Section */}
              <Card className="space-y-5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#096E21] border-b border-[#E5E5E5] pb-3">
                  <MapPin className="w-4 h-4" />
                  <span>2. Delivery Address & Landmark</span>
                </div>

                <Input
                  label="Street Address / Building Number"
                  placeholder="e.g. Flat 4B, Plot 14 Admiralty Way"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  error={errors.addressLine1}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Area / Neighborhood"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    options={[
                      { value: 'Lekki Phase 1', label: 'Lekki Phase 1 (Island)' },
                      { value: 'Victoria Island', label: 'Victoria Island (Island)' },
                      { value: 'Ikoyi', label: 'Ikoyi (Island)' },
                      { value: 'Oniru', label: 'Oniru / Maroko' },
                      { value: 'Ikeja GRA', label: 'Ikeja GRA (Mainland)' },
                      { value: 'Yaba / Surulere', label: 'Yaba / Surulere (Mainland)' },
                      { value: 'Abuja Central', label: 'Abuja Central / Wuse / Maitama' },
                    ]}
                    error={errors.city}
                  />

                  <Select
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    options={[
                      { value: 'Lagos', label: 'Lagos State' },
                      { value: 'Abuja FCT', label: 'Abuja FCT' },
                      { value: 'Rivers', label: 'Port Harcourt (Rivers)' },
                    ]}
                  />
                </div>

                <Input
                  label="Nearest Landmark (Optional)"
                  placeholder="e.g. Beside Ebeano Supermarket, Opposite Zenith Bank"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#096E21] focus:border-[#096E21]"
                    placeholder="e.g. Call at the main security gate / Leave with receptionist"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                  />
                </div>
              </Card>

              {/* Submit to review */}
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className="w-full justify-center shadow-sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Order Review
              </Button>
            </form>
          ) : (
            /* Order Review Screen */
            <div className="space-y-6">
              <Card className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#096E21]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Review Recipient & Delivery Information</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('details')}
                    className="text-xs font-semibold text-[#096E21] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#666666] block">Customer Name</span>
                    <span className="font-semibold text-sm text-[#1A1A1A]">
                      {firstName} {lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Contact Phone</span>
                    <span className="font-semibold text-sm text-[#1A1A1A]">
                      {phone}
                    </span>
                  </div>
                  {email && (
                    <div>
                      <span className="text-[#666666] block">Email Address</span>
                      <span className="font-medium text-[#1A1A1A]">{email}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[#666666] block">Delivery Location</span>
                    <span className="font-medium text-[#1A1A1A]">
                      {city}, {state}
                    </span>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-[#E5E5E5]">
                    <span className="text-[#666666] block">Full Street Address</span>
                    <span className="font-medium text-[#1A1A1A]">{addressLine1}</span>
                    {landmark && (
                      <span className="block text-[#666666] mt-0.5">
                        Landmark: {landmark}
                      </span>
                    )}
                    {deliveryInstructions && (
                      <span className="block text-amber-700 bg-amber-50 p-2 rounded mt-1.5">
                        Note: {deliveryInstructions}
                      </span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Order Confirmation Code notice */}
              <div className="p-4 rounded-xl bg-[#FEF2A3]/30 border border-[#FEF2A3] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#096E21] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-[#096E21]">
                    Official Order Code Generation
                  </div>
                  <p className="text-[#666666] leading-relaxed">
                    Once payment is verified, the server generates a unique order code (e.g.{' '}
                    <code className="font-bold text-[#096E21]">MP-XXXXX</code>). Keep this code to confirm receipt of your food on our delivery page.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setCurrentStep('details')}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="accent"
                  size="lg"
                  className="flex-1 justify-center shadow-sm"
                  onClick={handleFinalSubmit}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Payment (₦{totalAmount.toLocaleString()})
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-[#1A1A1A] font-heading border-b border-[#E5E5E5] pb-3">
              Order Summary
            </h3>

            {/* Selected Plan Details */}
            <div className="flex items-start gap-3.5">
              <img
                src={plan.imageUrl}
                alt={plan.name}
                className="w-16 h-16 rounded-xl object-cover border border-[#E5E5E5] shrink-0"
              />
              <div className="flex-1 space-y-1">
                <div className="text-xs font-semibold text-[#096E21]">
                  {plan.duration} {plan.durationUnit} · {plan.mealCount} Meals
                </div>
                <h4 className="font-bold text-sm text-[#1A1A1A] leading-snug">
                  {plan.name}
                </h4>
                <div className="text-xs text-[#666666]">
                  ₦{plan.price.toLocaleString()} per subscription
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-[#E5E5E5]">
              <span className="text-xs font-semibold text-[#1A1A1A]">
                Subscription Quantity
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-md bg-white border border-[#E5E5E5] flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-[#1A1A1A] w-4 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-md bg-white border border-[#E5E5E5] flex items-center justify-center text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-2 text-xs border-t border-[#E5E5E5]">
              <div className="flex justify-between text-[#666666]">
                <span>
                  Meal Plan Subtotal ({quantity} {quantity === 1 ? 'pack' : 'packs'})
                </span>
                <span className="font-medium text-[#1A1A1A]">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#096E21]" />
                  Doorstep Thermal Delivery
                </span>
                <span className="font-medium text-[#1A1A1A]">
                  ₦{deliveryFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>Special Promo Discount</span>
                <span className="font-medium text-[#096E21]">₦0 (No discount code)</span>
              </div>
            </div>

            {/* Total Amount */}
            <div className="pt-3 border-t border-[#E5E5E5] flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider block">
                  Total Payable
                </span>
                <span className="text-2xl font-bold text-[#096E21] font-sans">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
              <span className="text-[11px] text-[#666666]">All taxes included</span>
            </div>

            {/* Safety badge */}
            <div className="pt-2 text-[11px] text-[#666666] flex items-center gap-2 border-t border-[#E5E5E5]">
              <ShieldCheck className="w-4 h-4 text-[#096E21] shrink-0" />
              <span>
                Verified 256-bit encrypted checkout. No card numbers saved.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
