import React from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Customer, Order } from '@/src/types';
import { NuedeStore } from '@/src/services/store';
import { Phone, Mail, MapPin, Calendar, ShoppingBag, Plus, Copy } from 'lucide-react';
import { useToast } from '@/src/components/ui/Toast';

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateOrderForCustomer: (customer: Customer) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onCreateOrderForCustomer,
}) => {
  const { showToast } = useToast();
  if (!customer) return null;

  const orders = NuedeStore.getOrdersByCustomerId(customer.id);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Order code ${code} copied`, 'info');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title="Customer Profile & Order History">
      <div className="space-y-6">
        {/* Customer Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
          <div>
            <h3 className="text-lg font-bold font-heading text-[#1A1A1A]">
              {customer.firstName} {customer.lastName}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#666666] mt-1">
              <span className="flex items-center gap-1 font-semibold text-[#096E21]">
                <Phone className="w-3.5 h-3.5" />
                {customer.phone}
              </span>
              {customer.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {customer.email}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(customer.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={customer.source} type="source" size="sm" />
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onClose();
                onCreateOrderForCustomer(customer);
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              New Order
            </Button>
          </div>
        </div>

        {/* Address & Internal Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-[#E5E5E5] space-y-1">
            <span className="font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#096E21]" />
              <span>Default Delivery Address</span>
            </span>
            {customer.defaultAddress ? (
              <div className="text-[#666666] pt-1">
                <p className="font-medium text-[#1A1A1A]">{customer.defaultAddress.addressLine1}</p>
                <p>{customer.defaultAddress.city}, {customer.defaultAddress.state}</p>
                {customer.defaultAddress.landmark && (
                  <p className="text-amber-800 mt-1">Landmark: {customer.defaultAddress.landmark}</p>
                )}
              </div>
            ) : (
              <p className="text-neutral-400 italic pt-1">No default address on file</p>
            )}
          </div>

          <div className="p-3.5 rounded-xl border border-[#E5E5E5] space-y-1">
            <span className="font-bold text-[#1A1A1A] uppercase tracking-wider">
              Staff Notes
            </span>
            <p className="text-[#666666] pt-1 leading-relaxed">
              {customer.notes || 'No specific dietary or operational notes entered.'}
            </p>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#096E21]" />
              <span>Order History ({orders.length})</span>
            </span>
            <span className="text-xs text-[#666666]">
              Total Lifetime Orders: {customer.orderCount || orders.length}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#666666] bg-neutral-50 rounded-xl">
              No orders placed by this customer yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5] text-[#666666] font-semibold bg-neutral-50/60">
                    <th className="py-2.5 px-3">Order Code</th>
                    <th className="py-2.5 px-3">Meal Plan</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#096E21]">
                        <div className="flex items-center gap-1">
                          <span>{ord.orderCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(ord.orderCode)}
                            className="text-neutral-400 hover:text-neutral-700 p-0.5"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-[#1A1A1A]">{ord.mealPlanSnapshot.name}</span>
                        <span className="text-[#666666] ml-1">({ord.quantity}x)</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={ord.orderStatus} type="order" size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-[#666666]">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#1A1A1A]">
                        ₦{ord.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
