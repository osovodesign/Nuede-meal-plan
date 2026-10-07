import React from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { Delivery, DeliveryPersonnel, Order } from '@/src/types';
import { NuedeStore } from '@/src/services/store';
import { useToast } from '@/src/components/ui/Toast';
import { Truck, CheckCircle2, Phone, MapPin, UserCheck, AlertCircle } from 'lucide-react';

interface AssignRiderModalProps {
  delivery: Delivery | null;
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;
}

export const AssignRiderModal: React.FC<AssignRiderModalProps> = ({
  delivery,
  order,
  isOpen,
  onClose,
  onAssigned,
}) => {
  const { showToast } = useToast();
  if (!delivery || !order) return null;

  const personnelList = NuedeStore.getDeliveryPersonnel().filter((p) => p.isActive);

  const handleAssign = (person: DeliveryPersonnel) => {
    const updated = NuedeStore.assignDeliveryPersonnel(delivery.id, person.id);
    if (updated) {
      showToast(
        `Order ${order.orderCode} assigned to rider ${person.firstName} ${person.lastName}!`,
        'success'
      );
      onAssigned();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={`Assign Delivery Rider: ${order.orderCode}`}
    >
      <div className="space-y-5">
        {/* Destination preview card */}
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-[#E5E5E5] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1A1A1A]">
              Customer: {order.customerSnapshot.firstName} {order.customerSnapshot.lastName}
            </span>
            <span className="font-mono font-bold text-[#096E21]">{order.orderCode}</span>
          </div>
          <div className="flex items-start gap-1.5 text-[#666666]">
            <MapPin className="w-3.5 h-3.5 text-[#096E21] shrink-0 mt-0.5" />
            <span>
              {order.deliveryAddress.addressLine1}, {order.deliveryAddress.city},{' '}
              {order.deliveryAddress.state}
            </span>
          </div>
        </div>

        {/* Courier list */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] block">
            Select Active Courier ({personnelList.length} Available)
          </span>

          {personnelList.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#666666] border border-dashed rounded-xl">
              No active couriers available in roster. Please add or activate couriers.
            </div>
          ) : (
            <div className="space-y-2">
              {personnelList.map((person) => {
                const isCurrentlyAssigned =
                  delivery.deliveryPersonnelId === person.id;

                return (
                  <div
                    key={person.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isCurrentlyAssigned
                        ? 'border-[#096E21] bg-[#096E21]/5'
                        : 'border-[#E5E5E5] bg-white hover:border-[#096E21]/50'
                    }`}
                  >
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A1A1A]">
                          {person.firstName} {person.lastName}
                        </span>
                        <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                          {person.vehicleType} · {person.vehicleNumber || 'No plate'}
                        </span>
                      </div>
                      <div className="text-[#666666] flex items-center gap-2">
                        <span>{person.phone}</span>
                        {person.notes && <span>· {person.notes}</span>}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isCurrentlyAssigned ? 'outline' : 'primary'}
                      onClick={() => handleAssign(person)}
                    >
                      {isCurrentlyAssigned ? 'Assigned' : 'Assign'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-[#E5E5E5] flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
