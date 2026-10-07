import React, { useState } from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Select } from '@/src/components/ui/Select';
import { Order, OrderStatus, PaymentStatus } from '@/src/types';
import { NuedeStore } from '@/src/services/store';
import { useToast } from '@/src/components/ui/Toast';
import {
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
} from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: () => void;
  onAssignRiderClick?: (order: Order) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
  onAssignRiderClick,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order?.orderStatus || 'pending');
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<PaymentStatus>(
    order?.paymentStatus || 'successful'
  );

  if (!order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    showToast(`Order code ${order.orderCode} copied!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    const updated = NuedeStore.updateOrderStatus(order.id, newStatus);
    if (updated) {
      showToast(`Order status updated to ${newStatus.replace('_', ' ')}`, 'success');
      onOrderUpdated();
    }
  };

  const handlePaymentStatusChange = (newPayStatus: PaymentStatus) => {
    setCurrentPaymentStatus(newPayStatus);
    const updated = NuedeStore.updateOrderPaymentStatus(order.id, newPayStatus);
    if (updated) {
      showToast(`Payment status updated to ${newPayStatus}`, 'success');
      onOrderUpdated();
    }
  };

  // Find assigned personnel if delivery exists
  const delivery = order.deliveryId ? NuedeStore.getDeliveries().find(d => d.id === order.deliveryId) : null;
  const personnel = delivery?.deliveryPersonnelId
    ? NuedeStore.getDeliveryPersonnel().find(p => p.id === delivery.deliveryPersonnelId)
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" title={`Order Details: ${order.orderCode}`}>
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FEF2A3]/30 border border-[#FEF2A3]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-extrabold text-[#096E21] tracking-wider">
                {order.orderCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-white border border-[#E5E5E5] hover:bg-neutral-100 text-[#1A1A1A] cursor-pointer"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-[#096E21]" /> : <Copy className="w-4 h-4 text-neutral-500" />}
              </button>
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              Source: <strong className="capitalize text-[#1A1A1A]">{order.source}</strong> · Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={order.orderStatus} type="order" />
            <StatusBadge status={order.paymentStatus} type="payment" />
          </div>
        </div>

        {/* Status Transition Control Panel */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] block">
            Operational Lifecycle Controls
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Order Lifecycle Stage"
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              options={[
                { value: 'pending', label: '1. Pending' },
                { value: 'preparing', label: '2. Preparing (Kitchen Prep)' },
                { value: 'ready', label: '3. Ready for Dispatch' },
                { value: 'assigned', label: '4. Assigned to Delivery Rider' },
                { value: 'out_for_delivery', label: '5. Out for Delivery' },
                { value: 'delivered', label: '6. Delivered (Awaiting Confirmation)' },
                { value: 'customer_confirmed', label: '7. Customer Confirmed' },
                { value: 'failed', label: 'Failed Delivery' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />

            <Select
              label="Payment Reconciliation Status"
              value={order.paymentStatus}
              onChange={(e) => handlePaymentStatusChange(e.target.value as PaymentStatus)}
              options={[
                { value: 'successful', label: 'Successful (Paid)' },
                { value: 'pending', label: 'Pending Payment' },
                { value: 'failed', label: 'Failed' },
                { value: 'refunded', label: 'Refunded' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
          </div>
        </div>

        {/* 2-Column Details Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Customer & Address Information */}
          <div className="space-y-4 p-4 rounded-xl border border-[#E5E5E5] bg-white">
            <span className="font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E5E5E5] pb-2">
              <User className="w-3.5 h-3.5 text-[#096E21]" />
              <span>Customer & Destination</span>
            </span>

            <div className="space-y-2.5">
              <div>
                <span className="text-[#666666] block">Recipient Name</span>
                <span className="font-bold text-sm text-[#1A1A1A]">
                  {order.customerSnapshot.firstName} {order.customerSnapshot.lastName}
                </span>
              </div>

              <div>
                <span className="text-[#666666] block">Phone Contact</span>
                <div className="font-semibold text-[#096E21] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{order.customerSnapshot.phone}</span>
                </div>
              </div>

              {order.customerSnapshot.email && (
                <div>
                  <span className="text-[#666666] block">Email</span>
                  <span className="font-medium text-[#1A1A1A]">{order.customerSnapshot.email}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#E5E5E5]">
                <span className="text-[#666666] block">Delivery Address</span>
                <div className="font-medium text-[#1A1A1A] pt-0.5">
                  <p>{order.deliveryAddress.addressLine1}</p>
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-amber-800 mt-1">Landmark: {order.deliveryAddress.landmark}</p>
                  )}
                  {order.deliveryAddress.deliveryInstructions && (
                    <p className="text-blue-700 bg-blue-50 p-2 rounded mt-1.5">
                      Instructions: {order.deliveryAddress.deliveryInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Meal Plan Snapshot & Financials */}
          <div className="space-y-4 p-4 rounded-xl border border-[#E5E5E5] bg-white">
            <span className="font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E5E5E5] pb-2">
              <ShoppingBag className="w-3.5 h-3.5 text-[#096E21]" />
              <span>Purchased Plan & Financials</span>
            </span>

            <div className="space-y-2.5">
              <div>
                <span className="text-[#666666] block">Subscribed Plan</span>
                <span className="font-bold text-sm text-[#1A1A1A]">
                  {order.mealPlanSnapshot.name}
                </span>
                <span className="text-[#096E21] font-semibold block mt-0.5">
                  {order.mealPlanSnapshot.duration} {order.mealPlanSnapshot.durationUnit} · {order.mealPlanSnapshot.mealCount} Fresh Meals
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E5E5E5]">
                <div className="flex justify-between text-[#666666]">
                  <span>Quantity:</span>
                  <span className="font-semibold text-[#1A1A1A]">{order.quantity} pack(s)</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Unit Price:</span>
                  <span>₦{order.unitPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Plan Subtotal:</span>
                  <span>₦{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Delivery Fee:</span>
                  <span>₦{order.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E5E5E5] text-sm font-bold text-[#096E21]">
                  <span>Total Payable:</span>
                  <span>₦{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {order.paymentId && (
                <div className="pt-2 border-t border-[#E5E5E5]">
                  <span className="text-[#666666] block">Payment Gateway Ref</span>
                  <span className="font-mono text-[11px] text-neutral-600 truncate block">
                    {order.paymentId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Dispatch Roster Info */}
        <div className="p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#096E21]/10 text-[#096E21] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-[#1A1A1A] block">
                {personnel
                  ? `Assigned Rider: ${personnel.firstName} ${personnel.lastName} (${personnel.vehicleType})`
                  : 'No Delivery Personnel Assigned Yet'}
              </span>
              <span className="text-[#666666]">
                {personnel ? `Phone: ${personnel.phone} · Reg: ${personnel.vehicleNumber || 'N/A'}` : 'Assign a dedicated courier for morning dispatch.'}
              </span>
            </div>
          </div>

          {onAssignRiderClick && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onAssignRiderClick(order);
              }}
            >
              {personnel ? 'Reassign Rider' : 'Assign Rider'}
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            leftIcon={<Copy className="w-3.5 h-3.5" />}
          >
            Copy Order Code
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
