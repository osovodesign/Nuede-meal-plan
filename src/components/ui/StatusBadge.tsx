import React from 'react';
import { OrderStatus, PaymentStatus, DeliveryStatus, OrderSource } from '@/src/types';

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | DeliveryStatus | OrderSource | string;
  type?: 'order' | 'payment' | 'delivery' | 'source';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'order',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-neutral-100 text-neutral-700 border border-neutral-200';
  let label = String(status).replace(/_/g, ' ');

  if (type === 'order') {
    switch (status as OrderStatus) {
      case 'pending':
        colorClasses = 'bg-amber-50 text-amber-800 border border-amber-200';
        label = 'Pending';
        break;
      case 'preparing':
        colorClasses = 'bg-blue-50 text-blue-800 border border-blue-200';
        label = 'Preparing';
        break;
      case 'ready':
        colorClasses = 'bg-indigo-50 text-indigo-800 border border-indigo-200';
        label = 'Ready for Dispatch';
        break;
      case 'assigned':
        colorClasses = 'bg-purple-50 text-purple-800 border border-purple-200';
        label = 'Assigned to Rider';
        break;
      case 'out_for_delivery':
        colorClasses = 'bg-[#FF7B16]/10 text-[#FF7B16] border border-[#FF7B16]/30 font-medium';
        label = 'Out for Delivery';
        break;
      case 'delivered':
        colorClasses = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
        label = 'Delivered (Awaiting Confirmation)';
        break;
      case 'customer_confirmed':
        colorClasses = 'bg-[#096E21]/15 text-[#096E21] border border-[#096E21]/30 font-semibold';
        label = 'Customer Confirmed';
        break;
      case 'failed':
        colorClasses = 'bg-rose-50 text-rose-800 border border-rose-200';
        label = 'Failed Delivery';
        break;
      case 'cancelled':
        colorClasses = 'bg-neutral-100 text-neutral-600 border border-neutral-300';
        label = 'Cancelled';
        break;
    }
  } else if (type === 'payment') {
    switch (status as PaymentStatus) {
      case 'successful':
        colorClasses = 'bg-[#096E21]/15 text-[#096E21] border border-[#096E21]/30 font-medium';
        label = 'Paid (Successful)';
        break;
      case 'pending':
        colorClasses = 'bg-amber-50 text-amber-800 border border-amber-200';
        label = 'Payment Pending';
        break;
      case 'failed':
        colorClasses = 'bg-rose-50 text-rose-800 border border-rose-200';
        label = 'Payment Failed';
        break;
      case 'refunded':
        colorClasses = 'bg-slate-100 text-slate-800 border border-slate-300';
        label = 'Refunded';
        break;
      case 'cancelled':
        colorClasses = 'bg-neutral-100 text-neutral-600 border border-neutral-300';
        label = 'Cancelled';
        break;
    }
  } else if (type === 'source') {
    switch (status as OrderSource) {
      case 'website':
        colorClasses = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
        label = 'Website';
        break;
      case 'whatsapp':
        colorClasses = 'bg-green-50 text-green-800 border border-green-200';
        label = 'WhatsApp';
        break;
      case 'instagram':
        colorClasses = 'bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200';
        label = 'Instagram';
        break;
      case 'phone':
        colorClasses = 'bg-sky-50 text-sky-800 border border-sky-200';
        label = 'Phone Call';
        break;
      case 'walk_in':
        colorClasses = 'bg-orange-50 text-orange-800 border border-orange-200';
        label = 'Walk-in';
        break;
      default:
        colorClasses = 'bg-neutral-100 text-neutral-700 border border-neutral-200';
        label = 'Other';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md tracking-tight ${sizeClasses} ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
};
