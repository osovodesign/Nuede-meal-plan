import React, { useState, useEffect } from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { DeliveryPersonnel } from '@/src/types';
import { NuedeStore } from '@/src/services/store';
import { useToast } from '@/src/components/ui/Toast';
import { ArrowRight } from 'lucide-react';

interface PersonnelFormModalProps {
  personToEdit: DeliveryPersonnel | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const PersonnelFormModal: React.FC<PersonnelFormModalProps> = ({
  personToEdit,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState<'Motorcycle' | 'Bicycle' | 'Van' | 'Car'>('Motorcycle');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (personToEdit) {
      setFirstName(personToEdit.firstName);
      setLastName(personToEdit.lastName);
      setPhone(personToEdit.phone);
      setEmail(personToEdit.email || '');
      setVehicleType(personToEdit.vehicleType || 'Motorcycle');
      setVehicleNumber(personToEdit.vehicleNumber || '');
      setNotes(personToEdit.notes || '');
      setIsActive(personToEdit.isActive);
    } else {
      setFirstName('');
      setLastName('');
      setPhone('');
      setEmail('');
      setVehicleType('Motorcycle');
      setVehicleNumber('');
      setNotes('');
      setIsActive(true);
    }
  }, [personToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      showToast('First name, last name, and phone number are required', 'error');
      return;
    }

    const personData: DeliveryPersonnel = {
      id: personToEdit ? personToEdit.id : `dp_${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      vehicleType,
      vehicleNumber: vehicleNumber.trim() || null,
      notes: notes.trim() || null,
      isActive,
      createdAt: personToEdit ? personToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    NuedeStore.saveDeliveryPersonnel(personData);
    showToast(
      personToEdit
        ? `Rider ${personData.firstName} ${personData.lastName} updated!`
        : `New courier ${personData.firstName} ${personData.lastName} added!`,
      'success'
    );
    onSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={personToEdit ? `Edit Rider: ${personToEdit.firstName} ${personToEdit.lastName}` : 'Add Delivery Courier'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-[#666666] -mt-2">
          Manage dedicated dispatch riders and drivers assigned to morning meal deliveries.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="e.g. Tunde"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Last Name"
            placeholder="e.g. Adeleke"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Contact"
            placeholder="0802 345 6781"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="Email Address (Optional)"
            placeholder="rider@nuede.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Vehicle Type"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as any)}
            options={[
              { value: 'Motorcycle', label: 'Motorcycle (Dispatch Bike)' },
              { value: 'Van', label: 'Van (Corporate Bulk)' },
              { value: 'Car', label: 'Car / Sedan' },
              { value: 'Bicycle', label: 'Bicycle' },
            ]}
          />

          <Input
            label="Vehicle Registration Number"
            placeholder="e.g. LND-429-XY"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
            Routes & Dispatch Notes
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2 text-xs text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#096E21]"
            placeholder="e.g. Primary route: Lekki Phase 1 & Victoria Island morning deliveries"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Active toggle */}
        <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#1A1A1A] block">Available For Dispatch</span>
            <span className="text-[#666666]">Inactive riders cannot be assigned to new orders.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isActive ? 'bg-[#096E21]' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
            {personToEdit ? 'Save Changes' : 'Add Courier'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
