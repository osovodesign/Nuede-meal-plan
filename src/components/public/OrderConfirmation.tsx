import React, { useState } from 'react';
import { Order } from '@/src/types';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { useToast } from '@/src/components/ui/Toast';
import {
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Truck,
  MapPin,
  Utensils,
  ArrowRight,
  Clock,
  Printer,
} from 'lucide-react';

interface OrderConfirmationProps {
  order: Order;
  onNavigateHome: () => void;
  onNavigateToConfirmDelivery: (orderCode: string) => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onNavigateHome,
  onNavigateToConfirmDelivery,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    showToast(`Order code ${order.orderCode} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#096E21]/15 text-[#096E21] flex items-center justify-center mx-auto border-4 border-white shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#1A1A1A]">
          Your Order is Confirmed!
        </h1>
        <p className="text-sm text-[#666666] max-w-md mx-auto font-body">
          Payment has been verified server-side. Our kitchen is preparing your fresh meal plan subscription.
        </p>
      </div>

      {/* Prominent Order Code Spotlight Card */}
      <div className="rounded-2xl bg-white border-2 border-[#096E21] p-6 sm:p-8 shadow-sm space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#096E21] bg-[#FEF2A3] px-3 py-1 rounded-full inline-block">
          Important: Your Unique Order Code
        </span>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#096E21] tracking-wider select-all">
            {order.orderCode}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#1A1A1A] text-xs font-semibold transition-colors cursor-pointer"
            aria-label="Copy order code"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#096E21]" />
                <span className="text-[#096E21]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-500" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#FEF2A3]/30 border border-[#FEF2A3] text-xs text-[#1A1A1A] leading-relaxed max-w-xl mx-auto">
          <strong>Save this code!</strong> When our dispatch rider delivers your thermal meal box, visit the{' '}
          <span className="font-semibold text-[#096E21]">Confirm Delivery</span> page and enter this code to verify receipt of your food.
        </div>
      </div>

      {/* Order & Delivery Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meal Plan & Status */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              Meal Plan Details
            </span>
            <StatusBadge status={order.orderStatus} type="order" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-sm font-bold text-[#1A1A1A] font-heading">
                {order.mealPlanSnapshot.name}
              </div>
              <div className="text-[#096E21] font-semibold mt-0.5">
                {order.mealPlanSnapshot.duration} {order.mealPlanSnapshot.durationUnit} · {order.mealPlanSnapshot.mealCount} Fresh Meals
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t border-[#E5E5E5] text-[#666666]">
              <span>Quantity:</span>
              <span className="font-medium text-[#1A1A1A]">{order.quantity} Subscription pack</span>
            </div>

            <div className="flex justify-between text-[#666666]">
              <span>Unit Price:</span>
              <span className="font-medium text-[#1A1A1A]">
                ₦{order.unitPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-[#666666]">
              <span>Delivery Fee:</span>
              <span className="font-medium text-[#1A1A1A]">
                ₦{order.deliveryFee.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-[#E5E5E5] text-sm font-bold text-[#096E21]">
              <span>Total Paid:</span>
              <span>₦{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Recipient & Dispatch Address */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              Delivery Destination
            </span>
            <StatusBadge status={order.paymentStatus} type="payment" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#666666] block">Customer Name</span>
              <span className="font-semibold text-[#1A1A1A] text-sm">
                {order.customerSnapshot.firstName} {order.customerSnapshot.lastName}
              </span>
            </div>

            <div>
              <span className="text-[#666666] block">Contact Phone</span>
              <span className="font-semibold text-[#1A1A1A]">
                {order.customerSnapshot.phone}
              </span>
            </div>

            <div>
              <span className="text-[#666666] block">Address</span>
              <span className="font-medium text-[#1A1A1A] block">
                {order.deliveryAddress.addressLine1}
              </span>
              <span className="text-[#666666]">
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </span>
            </div>

            {order.deliveryAddress.landmark && (
              <div>
                <span className="text-[#666666] block">Landmark</span>
                <span className="text-[#1A1A1A]">{order.deliveryAddress.landmark}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#E5E5E5] flex items-center gap-1.5 text-[#096E21] font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Dispatches Daily: 7:00 AM - 9:30 AM</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button
          size="lg"
          variant="primary"
          onClick={() => onNavigateToConfirmDelivery(order.orderCode)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Go To Delivery Confirmation
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={onNavigateHome}
          className="w-full sm:w-auto"
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  );
};
