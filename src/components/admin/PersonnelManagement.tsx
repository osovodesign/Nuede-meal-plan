import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { DeliveryPersonnel } from '@/src/types';
import { NuedeStore } from '@/src/services/store';
import { useToast } from '@/src/components/ui/Toast';
import { UserCheck, Plus, Edit2, Phone, Mail, Truck, ShieldCheck } from 'lucide-react';
import { PersonnelFormModal } from './PersonnelFormModal';

export const PersonnelManagement: React.FC = () => {
  const { showToast } = useToast();
  const [personnelList, setPersonnelList] = useState<DeliveryPersonnel[]>(() =>
    NuedeStore.getDeliveryPersonnel()
  );
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personToEdit, setPersonToEdit] = useState<DeliveryPersonnel | null>(null);

  const reloadPersonnel = () => {
    setPersonnelList(NuedeStore.getDeliveryPersonnel());
  };

  const handleToggleActive = (person: DeliveryPersonnel) => {
    const updated: DeliveryPersonnel = {
      ...person,
      isActive: !person.isActive,
      updatedAt: new Date().toISOString(),
    };
    NuedeStore.saveDeliveryPersonnel(updated);
    reloadPersonnel();
    showToast(
      updated.isActive
        ? `${person.firstName} ${person.lastName} is now active for dispatch`
        : `${person.firstName} ${person.lastName} deactivated from dispatch`,
      'info'
    );
  };

  const filtered = personnelList.filter((p) => {
    if (filter === 'active') return p.isActive;
    if (filter === 'inactive') return !p.isActive;
    return true;
  });

  const allDeliveries = NuedeStore.getDeliveries();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1A1A]">
            Delivery Personnel Roster
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage dedicated couriers, dispatch vehicles, route assignments, and driver availability.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            setPersonToEdit(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Delivery Courier
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4 bg-white border border-[#E5E5E5] shadow-xs">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: `All Couriers (${personnelList.length})` },
            { id: 'active', label: `Active (${personnelList.filter((p) => p.isActive).length})` },
            { id: 'inactive', label: `Inactive (${personnelList.filter((p) => !p.isActive).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#096E21] text-white shadow-xs font-semibold'
                  : 'bg-neutral-100 text-[#666666] hover:text-[#1A1A1A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((person) => {
          const assignedCount = allDeliveries.filter(
            (d) => d.deliveryPersonnelId === person.id
          ).length;

          return (
            <Card
              key={person.id}
              className={`p-5 space-y-4 border transition-all ${
                person.isActive
                  ? 'border-[#E5E5E5] bg-white hover:border-[#096E21]/50'
                  : 'border-neutral-200 bg-neutral-50/70 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1A1A1A]">
                    {person.firstName} {person.lastName}
                  </h3>
                  <div className="text-xs text-[#096E21] font-semibold flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{person.phone}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    person.isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {person.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Vehicle & Route info */}
              <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5] text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[#666666]">
                  <span>Vehicle:</span>
                  <strong className="text-[#1A1A1A]">
                    {person.vehicleType} · {person.vehicleNumber || 'No reg'}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-[#666666]">
                  <span>Total Deliveries:</span>
                  <span className="font-bold text-[#096E21]">{assignedCount} orders</span>
                </div>
                {person.notes && (
                  <p className="text-[11px] text-[#666666] pt-1 border-t border-[#E5E5E5] leading-relaxed">
                    {person.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setPersonToEdit(person);
                    setIsModalOpen(true);
                  }}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleToggleActive(person)}
                  className="text-xs text-neutral-600 hover:text-neutral-900"
                >
                  {person.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <PersonnelFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        personToEdit={personToEdit}
        onSaved={reloadPersonnel}
      />
    </div>
  );
};
