import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { NuedeStore } from '@/src/services/store';
import { Order, OrderStatus, PaymentStatus, OrderSource } from '@/src/types';
import { useToast } from '@/src/components/ui/Toast';
import {
  ShoppingBag,
  Search,
  Plus,
  Phone,
  Copy,
  Check,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { OrderDetailModal } from './OrderDetailModal';
import { CreateOrderModal } from './CreateOrderModal';

interface OrderManagementProps {
  onAssignRiderClick?: (order: Order) => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  onAssignRiderClick,
}) => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>(() => NuedeStore.getOrders());
  const [search, setSearch] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>('all');

  // Modals state
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);

  const reloadOrders = () => {
    setOrders(NuedeStore.getOrders());
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Order Code ${code} copied to clipboard`, 'info');
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = NuedeStore.updateOrderStatus(orderId, newStatus);
    if (updated) {
      reloadOrders();
      showToast(`Order ${updated.orderCode} updated to ${newStatus.replace('_', ' ')}`, 'success');
    }
  };

  // Filter pipeline
  const filteredOrders = orders.filter((ord) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ord.orderCode.toLowerCase().includes(q) ||
      ord.customerSnapshot.firstName.toLowerCase().includes(q) ||
      ord.customerSnapshot.lastName.toLowerCase().includes(q) ||
      ord.customerSnapshot.phone.includes(q) ||
      ord.mealPlanSnapshot.name.toLowerCase().includes(q);

    const matchesStatus =
      selectedStatusTab === 'all' || ord.orderStatus === selectedStatusTab;

    const matchesSource =
      selectedSourceFilter === 'all' || ord.source === selectedSourceFilter;

    const matchesPayment =
      selectedPaymentFilter === 'all' || ord.paymentStatus === selectedPaymentFilter;

    return matchesSearch && matchesStatus && matchesSource && matchesPayment;
  });

  // Counters for quick tabs
  const countAll = orders.length;
  const countPreparing = orders.filter((o) => o.orderStatus === 'preparing').length;
  const countOutForDelivery = orders.filter((o) => o.orderStatus === 'out_for_delivery').length;
  const countDelivered = orders.filter((o) => o.orderStatus === 'delivered').length;
  const countConfirmed = orders.filter((o) => o.orderStatus === 'customer_confirmed').length;

  return (
    <div className="space-y-6">
      {/* Top Header & New Order Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1A1A]">
            Order Management & Pipeline
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Centralized pipeline tracking all orders across Website, WhatsApp, Instagram, and Offline sales.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsCreateOrderModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Manual Order
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-4 bg-white border border-[#E5E5E5] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6">
            <Input
              placeholder="Search by Order Code (e.g. MP-48291), Customer Name, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="md:col-span-3">
            <Select
              options={[
                { value: 'all', label: 'All Sources' },
                { value: 'website', label: 'Website' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'phone', label: 'Phone Call' },
                { value: 'walk_in', label: 'Walk-in' },
              ]}
              value={selectedSourceFilter}
              onChange={(e) => setSelectedSourceFilter(e.target.value)}
            />
          </div>

          <div className="md:col-span-3">
            <Select
              options={[
                { value: 'all', label: 'All Payment States' },
                { value: 'successful', label: 'Paid (Successful)' },
                { value: 'pending', label: 'Payment Pending' },
                { value: 'failed', label: 'Failed' },
                { value: 'refunded', label: 'Refunded' },
              ]}
              value={selectedPaymentFilter}
              onChange={(e) => setSelectedPaymentFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Status Lifecycle Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E5E5E5]">
          {[
            { id: 'all', label: `All Orders (${countAll})` },
            { id: 'preparing', label: `Kitchen Prep (${countPreparing})` },
            { id: 'out_for_delivery', label: `Out for Delivery (${countOutForDelivery})` },
            { id: 'delivered', label: `Delivered - Awaiting Confirm (${countDelivered})` },
            { id: 'customer_confirmed', label: `Confirmed (${countConfirmed})` },
            { id: 'failed', label: 'Failed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                selectedStatusTab === tab.id
                  ? 'bg-[#096E21] text-white shadow-xs font-semibold'
                  : 'bg-neutral-100 text-[#666666] hover:text-[#1A1A1A] hover:bg-neutral-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-0 bg-white border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-[#666666] font-semibold bg-neutral-50/70">
                <th className="py-3.5 px-4">Order Code</th>
                <th className="py-3.5 px-4">Customer Contact</th>
                <th className="py-3.5 px-4">Meal Plan</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status & Transition</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-[#666666]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Order Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#096E21]">
                      <div className="flex items-center gap-1.5">
                        <span>{ord.orderCode}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(ord.orderCode)}
                          className="text-neutral-400 hover:text-neutral-700 p-0.5"
                          title="Copy order code"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-[10px] text-[#666666] font-sans font-normal mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1A1A1A]">
                        {ord.customerSnapshot.firstName} {ord.customerSnapshot.lastName}
                      </div>
                      <div className="text-[11px] text-[#666666] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#096E21]" />
                        <span>{ord.customerSnapshot.phone}</span>
                      </div>
                    </td>

                    {/* Meal Plan */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#1A1A1A]">
                        {ord.mealPlanSnapshot.name}
                      </div>
                      <div className="text-[11px] text-[#666666]">
                        {ord.mealPlanSnapshot.duration} {ord.mealPlanSnapshot.durationUnit} ({ord.quantity}x)
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ord.source} type="source" size="sm" />
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ord.paymentStatus} type="payment" size="sm" />
                    </td>

                    {/* Order Status & Direct Transition Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={ord.orderStatus} type="order" size="sm" />

                        <select
                          value={ord.orderStatus}
                          onChange={(e) =>
                            handleUpdateStatus(ord.id, e.target.value as OrderStatus)
                          }
                          className="text-[11px] border border-[#E5E5E5] rounded px-1.5 py-0.5 bg-white text-[#1A1A1A] cursor-pointer"
                          title="Change status"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="assigned">Assigned</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="customer_confirmed">Confirmed</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-bold text-[#1A1A1A] font-sans">
                      ₦{ord.totalAmount.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedOrderForDetail(ord)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Order Details */}
      <OrderDetailModal
        order={selectedOrderForDetail}
        isOpen={!!selectedOrderForDetail}
        onClose={() => setSelectedOrderForDetail(null)}
        onOrderUpdated={() => reloadOrders()}
        onAssignRiderClick={onAssignRiderClick}
      />

      {/* Modal: Create Order */}
      <CreateOrderModal
        isOpen={isCreateOrderModalOpen}
        onClose={() => setIsCreateOrderModalOpen(false)}
        onOrderCreated={() => reloadOrders()}
      />
    </div>
  );
};
