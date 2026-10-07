import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { NuedeStore } from '@/src/services/store';
import { Customer, OrderSource } from '@/src/types';
import { useToast } from '@/src/components/ui/Toast';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { CreateCustomerModal } from './CreateCustomerModal';
import { CustomerDetailModal } from './CustomerDetailModal';
import { CreateOrderModal } from './CreateOrderModal';

export const CustomerManagement: React.FC = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(() => NuedeStore.getCustomers());
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Modals state
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<Customer | null>(null);
  const [targetCustomerForNewOrder, setTargetCustomerForNewOrder] = useState<Customer | null>(null);

  const reloadCustomers = () => {
    setCustomers(NuedeStore.getCustomers());
  };

  const filteredCustomers = customers.filter((cust) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      cust.firstName.toLowerCase().includes(q) ||
      cust.lastName.toLowerCase().includes(q) ||
      cust.phone.includes(q) ||
      (cust.email && cust.email.toLowerCase().includes(q));

    const matchesSource =
      selectedSource === 'all' || cust.source === selectedSource;

    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1A1A]">
            Centralized Customer Directory
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Single registry for Website, WhatsApp, Instagram, and Offline customers with automatic phone deduplication.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setTargetCustomerForNewOrder(null);
              setIsCreateOrderOpen(true);
            }}
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            Create Manual Order
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreateCustomerOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Customer
          </Button>
        </div>
      </div>

      {/* Search and Source Filter Tabs */}
      <Card className="p-4 space-y-4 bg-white border border-[#E5E5E5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search by customer name, phone number, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="text-xs text-[#666666]">
            Showing <strong>{filteredCustomers.length}</strong> of{' '}
            <strong>{customers.length}</strong> registered customers
          </div>
        </div>

        {/* Source filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E5E5E5]">
          {[
            { id: 'all', label: 'All Sources' },
            { id: 'website', label: 'Website' },
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'instagram', label: 'Instagram' },
            { id: 'phone', label: 'Phone' },
            { id: 'walk_in', label: 'Walk-in' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSource(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                selectedSource === tab.id
                  ? 'bg-[#096E21] text-white shadow-xs font-semibold'
                  : 'bg-neutral-100 text-[#666666] hover:text-[#1A1A1A] hover:bg-neutral-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Customer Directory Table */}
      <Card className="p-0 bg-white border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-[#666666] font-semibold bg-neutral-50/70">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Default Address</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4">Date Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#666666]">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-[#1A1A1A]">
                        {cust.firstName} {cust.lastName}
                      </div>
                      {cust.email && (
                        <div className="text-[11px] text-[#666666] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{cust.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-[#096E21]">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{cust.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={cust.source} type="source" size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-[#666666] max-w-xs truncate">
                      {cust.defaultAddress ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#096E21] shrink-0" />
                          <span className="truncate">
                            {cust.defaultAddress.addressLine1}, {cust.defaultAddress.city}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">None saved</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-sm text-[#1A1A1A]">
                        {cust.orderCount || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#666666]">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedCustomerForDetail(cust)}
                        >
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setTargetCustomerForNewOrder(cust);
                            setIsCreateOrderOpen(true);
                          }}
                          className="text-[#096E21] hover:bg-[#096E21]/10 font-semibold"
                        >
                          + Order
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Add Customer */}
      <CreateCustomerModal
        isOpen={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
        onCustomerCreated={() => reloadCustomers()}
      />

      {/* Modal: Customer Details & Order History */}
      <CustomerDetailModal
        customer={selectedCustomerForDetail}
        isOpen={!!selectedCustomerForDetail}
        onClose={() => setSelectedCustomerForDetail(null)}
        onCreateOrderForCustomer={(cust) => {
          setTargetCustomerForNewOrder(cust);
          setIsCreateOrderOpen(true);
        }}
      />

      {/* Modal: Create Order */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        initialCustomer={targetCustomerForNewOrder}
        onOrderCreated={() => reloadCustomers()}
      />
    </div>
  );
};
