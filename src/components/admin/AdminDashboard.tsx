import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { NuedeStore } from '@/src/services/store';
import { Order, OrderStatus } from '@/src/types';
import { useToast } from '@/src/components/ui/Toast';
import {
  ShoppingBag,
  Users,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Phone,
  Copy,
  ChefHat,
  Search,
} from 'lucide-react';
import { CreateOrderModal } from './CreateOrderModal';
import { CreateCustomerModal } from './CreateCustomerModal';

interface AdminDashboardProps {
  onNavigateSection: (section: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateSection,
}) => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>(() => NuedeStore.getOrders());
  const [customers, setCustomers] = useState(() => NuedeStore.getCustomers());
  const mealPlans = NuedeStore.getActiveMealPlans();

  // Modals state
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);

  const refreshData = () => {
    setOrders(NuedeStore.getOrders());
    setCustomers(NuedeStore.getCustomers());
  };

  // Metrics computation
  const totalOrdersCount = orders.length;
  const preparingCount = orders.filter((o) => o.orderStatus === 'preparing').length;
  const outForDeliveryCount = orders.filter((o) => o.orderStatus === 'out_for_delivery').length;
  const deliveredAwaitingConfirmCount = orders.filter((o) => o.orderStatus === 'delivered').length;
  const confirmedCount = orders.filter((o) => o.orderStatus === 'customer_confirmed').length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'successful')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = NuedeStore.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(NuedeStore.getOrders());
      showToast(`Order ${updated.orderCode} status updated to ${newStatus.replace('_', ' ')}`, 'success');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Order code ${code} copied`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1A1A]">
            Operations Center
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Real-time management for website and social channel orders (WhatsApp, Instagram, Phone).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsCreateCustomerOpen(true)}
            leftIcon={<Users className="w-3.5 h-3.5" />}
          >
            Add Customer
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreateOrderOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Order
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2 p-4">
          <div className="flex items-center justify-between text-xs text-[#666666]">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#096E21]" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#1A1A1A]">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-[#096E21] font-medium">
            Across All Channels
          </div>
        </Card>

        <Card className="space-y-2 p-4">
          <div className="flex items-center justify-between text-xs text-[#666666]">
            <span>Kitchen Preparing</span>
            <ChefHat className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-blue-700">
            {preparingCount}
          </div>
          <div className="text-[11px] text-[#666666]">
            Active in Morning Prep
          </div>
        </Card>

        <Card className="space-y-2 p-4">
          <div className="flex items-center justify-between text-xs text-[#666666]">
            <span>Out for Delivery</span>
            <Truck className="w-4 h-4 text-[#FF7B16]" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#FF7B16]">
            {outForDeliveryCount}
          </div>
          <div className="text-[11px] text-[#666666]">
            Dispatched with Riders
          </div>
        </Card>

        <Card className="space-y-2 p-4">
          <div className="flex items-center justify-between text-xs text-[#666666]">
            <span>Customer Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-[#096E21]" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#096E21]">
            {confirmedCount}
          </div>
          <div className="text-[11px] text-[#096E21] font-semibold">
            {deliveredAwaitingConfirmCount} awaiting code verification
          </div>
        </Card>
      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#666666]">Total Revenue Paid</div>
            <div className="text-xl font-bold text-[#096E21] font-sans">
              ₦{totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#096E21]/10 text-[#096E21] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#666666]">Registered Customers</div>
            <div className="text-xl font-bold text-[#1A1A1A] font-sans">
              {customers.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#666666]">Active Catalog Plans</div>
            <div className="text-xl font-bold text-[#1A1A1A] font-sans">
              {mealPlans.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FEF2A3] text-[#096E21] flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Orders Operational Table */}
      <Card className="space-y-4 p-5 sm:p-6 bg-white border border-[#E5E5E5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
          <div>
            <h3 className="text-lg font-bold font-heading text-[#1A1A1A]">
              Recent Orders & Live Status
            </h3>
            <p className="text-xs text-[#666666]">
              Real-time pipeline across Website, WhatsApp, and Instagram customers.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateSection('orders')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View All ({orders.length})
          </Button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-[#666666] font-semibold bg-neutral-50/50">
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Meal Plan</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status & Quick Update</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                  {/* Order Code */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#096E21]">
                    <div className="flex items-center gap-1.5">
                      <span>{order.orderCode}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(order.orderCode)}
                        className="text-neutral-400 hover:text-neutral-700 p-0.5"
                        title="Copy order code"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1A1A1A]">
                      {order.customerSnapshot.firstName} {order.customerSnapshot.lastName}
                    </div>
                    <div className="text-[11px] text-[#666666] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#096E21]" />
                      <span>{order.customerSnapshot.phone}</span>
                    </div>
                  </td>

                  {/* Meal Plan */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#1A1A1A]">
                      {order.mealPlanSnapshot.name}
                    </div>
                    <div className="text-[11px] text-[#666666]">
                      {order.mealPlanSnapshot.duration} {order.mealPlanSnapshot.durationUnit} ({order.quantity}x)
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.source} type="source" size="sm" />
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                  </td>

                  {/* Order Status & Transition */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.orderStatus} type="order" size="sm" />

                      {/* Status Transition Shortcut */}
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, e.target.value as OrderStatus)
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
                    ₦{order.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Create Customer */}
      <CreateCustomerModal
        isOpen={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
        onCustomerCreated={() => refreshData()}
      />

      {/* Modal: Create Order */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        onOrderCreated={() => refreshData()}
      />
    </div>
  );
};
