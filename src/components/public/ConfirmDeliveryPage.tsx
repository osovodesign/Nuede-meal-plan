import React, { useState, useEffect } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { NuedeStore } from '@/src/services/store';
import { Order, DeliveryConfirmation } from '@/src/types';
import { useToast } from '@/src/components/ui/Toast';
import {
  CheckSquare,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  RotateCcw,
} from 'lucide-react';

interface ConfirmDeliveryPageProps {
  initialCode?: string;
  onNavigateHome: () => void;
}

export const ConfirmDeliveryPage: React.FC<ConfirmDeliveryPageProps> = ({
  initialCode = '',
  onNavigateHome,
}) => {
  const { showToast } = useToast();
  const [orderCodeInput, setOrderCodeInput] = useState(initialCode);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // States: 'input' | 'verified' | 'confirmed'
  const [viewState, setViewState] = useState<'input' | 'verified' | 'confirmed'>('input');
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationRecord, setConfirmationRecord] = useState<DeliveryConfirmation | null>(null);

  useEffect(() => {
    if (initialCode) {
      setOrderCodeInput(initialCode);
      handleVerifyCode(initialCode);
    }
  }, [initialCode]);

  const handleVerifyCode = (codeToVerify?: string) => {
    const code = (codeToVerify || orderCodeInput).trim().toUpperCase();
    setErrorMessage(null);

    if (!code) {
      setErrorMessage('Please enter your unique order code.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const order = NuedeStore.getOrderByCode(code);

      if (!order) {
        setErrorMessage(
          "We couldn't find an order with that code. Please check your order code (e.g. MP-59182) and try again."
        );
        showToast('Order code not found', 'error');
        return;
      }

      if (order.orderStatus === 'cancelled') {
        setErrorMessage(
          'This order was cancelled and cannot be confirmed. Please contact customer support if you need assistance.'
        );
        return;
      }

      if (order.orderStatus === 'customer_confirmed') {
        const confirmations = NuedeStore.getConfirmations();
        const conf = confirmations.find(
          (c) => c.orderCode.toUpperCase() === order.orderCode.toUpperCase()
        );
        setVerifiedOrder(order);
        setConfirmationRecord(conf || null);
        setViewState('confirmed');
        showToast('This delivery was already confirmed previously.', 'info');
        return;
      }

      // Valid order found!
      setVerifiedOrder(order);
      setViewState('verified');
      showToast('Order verified! Please confirm your delivery.', 'success');
    }, 600);
  };

  const handleConfirmReceived = () => {
    if (!verifiedOrder) return;

    setIsConfirming(true);

    setTimeout(() => {
      setIsConfirming(false);
      const result = NuedeStore.confirmDelivery(verifiedOrder.orderCode);

      if (result.success && result.order) {
        setVerifiedOrder(result.order);
        setConfirmationRecord(result.confirmation || null);
        setViewState('confirmed');
        showToast('Delivery confirmed! Thank you for choosing Nuede.', 'success');
      } else {
        setErrorMessage(result.message);
        showToast(result.message, 'error');
      }
    }, 800);
  };

  const handleReset = () => {
    setOrderCodeInput('');
    setVerifiedOrder(null);
    setErrorMessage(null);
    setConfirmationRecord(null);
    setViewState('input');
  };

  // Sample active code for user convenience testing
  const sampleDeliveries = NuedeStore.getOrders().filter(
    (o) => o.orderStatus === 'delivered' || o.orderStatus === 'out_for_delivery'
  );
  const sampleCode = sampleDeliveries[0]?.orderCode || 'MP-59182';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-[#096E21]/10 text-[#096E21] flex items-center justify-center mx-auto border-2 border-[#096E21]/20">
          <CheckSquare className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#1A1A1A]">
          Confirm Your Food Delivery
        </h1>
        <p className="text-sm text-[#666666] max-w-md mx-auto font-body">
          Zero login required. Enter your unique order code below to confirm you received your fresh food.
        </p>
      </div>

      {/* State 1: Input Order Code */}
      {viewState === 'input' && (
        <Card className="p-6 sm:p-8 bg-white border border-[#E5E5E5] shadow-xs space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyCode();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Enter Your Order Code
              </label>
              <Input
                placeholder="e.g. MP-48291"
                value={orderCodeInput}
                onChange={(e) => {
                  setOrderCodeInput(e.target.value.toUpperCase());
                  setErrorMessage(null);
                }}
                className="font-mono text-lg font-bold uppercase tracking-wider text-center"
                autoFocus
              />
              <p className="text-xs text-[#666666] text-center">
                This code was provided on your order confirmation screen and sent via SMS / WhatsApp.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full justify-center shadow-xs"
              isLoading={isVerifying}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Verify Order
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-4 border-t border-[#E5E5E5] text-center space-y-2">
            <span className="text-[11px] text-[#666666] block">
              Testing? Try this active delivered order code:
            </span>
            <button
              type="button"
              onClick={() => {
                setOrderCodeInput(sampleCode);
                handleVerifyCode(sampleCode);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF2A3] text-[#096E21] border border-amber-300 font-mono text-xs font-bold hover:bg-[#fff9c2] transition-colors cursor-pointer"
            >
              <span>{sampleCode}</span>
              <span className="text-[10px] font-sans font-medium text-[#666666]">
                (Click to auto-fill)
              </span>
            </button>
          </div>
        </Card>
      )}

      {/* State 2: Verified Order — "I Received My Food" CTA */}
      {viewState === 'verified' && verifiedOrder && (
        <Card className="p-6 sm:p-8 bg-white border border-[#E5E5E5] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#096E21]">
              Order Verified Successfully
            </span>
            <StatusBadge status={verifiedOrder.orderStatus} type="order" size="sm" />
          </div>

          {/* Privacy-Preserving Order Summary */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#666666]">Order Code:</span>
              <span className="font-mono font-bold text-base text-[#096E21]">
                {verifiedOrder.orderCode}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#666666]">Recipient:</span>
              <strong className="text-[#1A1A1A]">
                {verifiedOrder.customerSnapshot.firstName}{' '}
                {verifiedOrder.customerSnapshot.lastName.charAt(0)}.
              </strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#666666]">Meal Plan:</span>
              <span className="font-semibold text-[#1A1A1A]">
                {verifiedOrder.mealPlanSnapshot.name} ({verifiedOrder.quantity}x)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#666666]">Destination Area:</span>
              <span>{verifiedOrder.deliveryAddress.city}, {verifiedOrder.deliveryAddress.state}</span>
            </div>
          </div>

          {/* Confirmation Prompt */}
          <div className="p-4 rounded-xl bg-[#FEF2A3]/40 border border-[#FEF2A3] text-xs text-[#1A1A1A] leading-relaxed space-y-1">
            <strong>Have you received your thermal food container?</strong>
            <p className="text-[#666666]">
              By clicking below, you confirm that your meal was delivered safely and in good condition.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMessage}
            </div>
          )}

          {/* Primary Action */}
          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              className="w-full justify-center text-base py-4 font-bold shadow-sm"
              isLoading={isConfirming}
              onClick={handleConfirmReceived}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              I Received My Food
            </Button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full text-xs text-neutral-500 hover:text-neutral-800 py-2 cursor-pointer"
            >
              Enter a different order code
            </button>
          </div>
        </Card>
      )}

      {/* State 3: Delivery Confirmed Success Screen */}
      {viewState === 'confirmed' && verifiedOrder && (
        <Card className="p-6 sm:p-8 bg-white border-2 border-[#096E21] shadow-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#096E21]/15 text-[#096E21] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">
              Delivery Confirmed!
            </h2>
            <p className="text-xs text-[#666666]">
              Thank you for confirming your meal delivery. Your confirmation has been recorded in our central operations database.
            </p>
          </div>

          {/* Confirmation Audit Details */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] text-xs text-left space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#666666]">Order Code:</span>
              <span className="font-mono font-bold text-[#096E21]">
                {verifiedOrder.orderCode}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#666666]">Confirmation Status:</span>
              <span className="font-semibold text-[#096E21] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Customer Confirmed
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#666666]">Confirmed Timestamp:</span>
              <span className="text-[#1A1A1A]">
                {confirmationRecord
                  ? new Date(confirmationRecord.confirmedAt).toLocaleString()
                  : new Date().toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#666666]">Verification Method:</span>
              <span className="font-medium text-[#1A1A1A]">Unique Order Code</span>
            </div>
          </div>

          {/* Support Notice */}
          <div className="p-3.5 rounded-xl bg-[#FEF2A3]/30 border border-[#FEF2A3] text-xs text-[#666666] leading-relaxed">
            Enjoy your wholesome meal! If you have any feedback or special requests for upcoming deliveries, contact our kitchen team at <strong className="text-[#096E21]">+234 812 000 NUEDE</strong>.
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="md" variant="primary" onClick={onNavigateHome}>
              Return to Homepage
            </Button>
            <Button size="md" variant="secondary" onClick={handleReset}>
              Confirm Another Delivery
            </Button>
          </div>
        </Card>
      )}

      {/* Safety & Anti-Abuse Trust Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#666666]">
        <ShieldCheck className="w-4 h-4 text-[#096E21]" />
        <span>One-time idempotent verification protected against duplicate submissions.</span>
      </div>
    </div>
  );
};
