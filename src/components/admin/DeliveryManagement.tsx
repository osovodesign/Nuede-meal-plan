import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { NuedeStore } from '@/src/services/store';
import { Delivery, DeliveryStatus, Order } from '@/src/types';
import { useToast } from '@/src/components/ui/Toast';
import {
  Truck,
  UserCheck,
  MapPin,
  Clock,
  Phone,
  Copy,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { AssignRiderModal } from './AssignRiderModal';
import { Input } from '@/src/components/ui/Input';

export const DeliveryManagement: React.FC = () => {
  const { showToast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => NuedeStore.getDeliveries());
  const [orders, setOrders] = useState<Order[]>(() => NuedeStore.getOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal state
  const [selectedDeliveryForAssign, setSelectedDeliveryForAssign] = useState<Delivery | null>(null);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState<Order | null>(null);

  const reloadData = () => {
    setDeliveries(NuedeStore.getDeliveries());
    setOrders(NuedeStore.getOrders());
  };

  const personnelList = NuedeStore.getDeliveryPersonnel();

  const handleUpdateDeliveryStatus = (delivery: Delivery, newStatus: DeliveryStatus) => {
    // Also sync the order status!
    let matchingOrder = orders.find((o) => o.id === delivery.orderId);
    if (matchingOrder) {
      if (newStatus === 'out_for_delivery') {
        NuedeStore.updateOrderStatus(matchingOrder.id, 'out_for_delivery');
      } else if (newStatus === 'delivered') {
        NuedeStore.updateOrderStatus(matchingOrder.id, 'delivered');
      }
    }

    reloadData();
    showToast(`Delivery status updated to ${newStatus.replace('_', ' ')}`, 'success');
  };

  const handleOpenAssignModal = (del: Delivery) => {
    const matchingOrder = orders.find((o) => o.id === del.orderId);
    if (matchingOrder) {
      setSelectedDeliveryForAssign(del);
      setSelectedOrderForAssign(matchingOrder);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Order code ${code} copied`, 'info');
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((del) => {
    const matchingOrder = orders.find((o) => o.id === del.orderId);
    const q = search.toLowerCase().trim();

    const matchesSearch =
      !q ||
      (matchingOrder && matchingOrder.orderCode.toLowerCase().includes(q)) ||
      (matchingOrder && matchingOrder.customerSnapshot.firstName.toLowerCase().includes(q)) ||
      (matchingOrder && matchingOrder.customerSnapshot.lastName.toLowerCase().includes(q)) ||
      (matchingOrder && matchingOrder.customerSnapshot.phone.includes(q)) ||
      del.address.city.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all' ||
      del.status === statusFilter ||
      (statusFilter === 'confirmed' && matchingOrder?.orderStatus === 'customer_confirmed');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1A1A]">
            Delivery Dispatch & Fulfillment
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Assign dedicated couriers, monitor morning dispatch windows, and track arrival states.
          </p>
        </div>

        <div className="text-xs text-[#666666] bg-white border border-[#E5E5E5] px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#096E21]" />
          <span>Daily Dispatch Window: <strong>7:00 AM – 9:30 AM</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-4 bg-white border border-[#E5E5E5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search by Order Code, Customer, or Area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="text-xs text-[#666666]">
            Showing <strong>{filteredDeliveries.length}</strong> deliveries
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E5E5E5]">
          {[
            { id: 'all', label: `All Deliveries (${deliveries.length})` },
            { id: 'pending', label: 'Unassigned / Pending' },
            { id: 'assigned', label: 'Assigned to Courier' },
            { id: 'out_for_delivery', label: 'Out for Delivery' },
            { id: 'delivered', label: 'Delivered (Awaiting Confirmation)' },
            { id: 'confirmed', label: 'Customer Confirmed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#096E21] text-white shadow-xs font-semibold'
                  : 'bg-neutral-100 text-[#666666] hover:text-[#1A1A1A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Deliveries Table */}
      <Card className="p-0 bg-white border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-[#666666] font-semibold bg-neutral-50/70">
                <th className="py-3.5 px-4">Order Code</th>
                <th className="py-3.5 px-4">Customer & Phone</th>
                <th className="py-3.5 px-4">Delivery Address</th>
                <th className="py-3.5 px-4">Assigned Courier</th>
                <th className="py-3.5 px-4">Delivery Status</th>
                <th className="py-3.5 px-4 text-right">Dispatch Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-[#666666]">
                    No deliveries match the selected status filter.
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((del) => {
                  const matchingOrder = orders.find((o) => o.id === del.orderId);
                  const assignedRider = del.deliveryPersonnelId
                    ? personnelList.find((p) => p.id === del.deliveryPersonnelId)
                    : null;

                  return (
                    <tr key={del.id} className="hover:bg-neutral-50/70 transition-colors">
                      {/* Order Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#096E21]">
                        {matchingOrder ? (
                          <div className="flex items-center gap-1.5">
                            <span>{matchingOrder.orderCode}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(matchingOrder.orderCode)}
                              className="text-neutral-400 hover:text-neutral-700 p-0.5"
                              title="Copy code"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          del.orderId
                        )}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        {matchingOrder ? (
                          <div>
                            <div className="font-bold text-sm text-[#1A1A1A]">
                              {matchingOrder.customerSnapshot.firstName} {matchingOrder.customerSnapshot.lastName}
                            </div>
                            <div className="text-[11px] text-[#666666] flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-[#096E21]" />
                              <span>{matchingOrder.customerSnapshot.phone}</span>
                            </div>
                          </div>
                        ) : (
                          'Customer Details'
                        )}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 text-[#666666] max-w-xs">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#096E21] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-[#1A1A1A] block">
                              {del.address.addressLine1}
                            </span>
                            <span>{del.address.city}, {del.address.state}</span>
                            {del.address.landmark && (
                              <span className="block text-[11px] text-amber-800">
                                Landmark: {del.address.landmark}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Assigned Rider */}
                      <td className="py-3.5 px-4">
                        {assignedRider ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#1A1A1A] block">
                              {assignedRider.firstName} {assignedRider.lastName}
                            </span>
                            <span className="text-[11px] text-[#666666]">
                              {assignedRider.vehicleType} · {assignedRider.phone}
                            </span>
                          </div>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Delivery Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <StatusBadge status={del.status} type="delivery" size="sm" />
                          {matchingOrder?.orderStatus === 'customer_confirmed' && (
                            <div className="text-[10px] font-bold text-[#096E21] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Confirmed by Customer</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenAssignModal(del)}
                          >
                            {assignedRider ? 'Reassign' : 'Assign Rider'}
                          </Button>

                          {del.status === 'assigned' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateDeliveryStatus(del, 'out_for_delivery')}
                              className="text-[#FF7B16] border-[#FF7B16] hover:bg-[#FF7B16]/5"
                            >
                              Dispatch
                            </Button>
                          )}

                          {del.status === 'out_for_delivery' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleUpdateDeliveryStatus(del, 'delivered')}
                            >
                              Mark Delivered
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Assign Rider */}
      <AssignRiderModal
        delivery={selectedDeliveryForAssign}
        order={selectedOrderForAssign}
        isOpen={!!selectedDeliveryForAssign}
        onClose={() => setSelectedDeliveryForAssign(null)}
        onAssigned={reloadData}
      />
    </div>
  );
};
