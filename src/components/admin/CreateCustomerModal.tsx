import React, { useState } from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { NuedeStore, normalizePhone } from '@/src/services/store';
import { Customer, OrderSource } from '@/src/types';
import { useToast } from '@/src/components/ui/Toast';
import { UserPlus, AlertCircle, ArrowRight, Phone } from 'lucide-react';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: Customer) => void;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerCreated,
}) => {
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<OrderSource>('whatsapp');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('Lekki Phase 1');
  const [state, setState] = useState('Lagos');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');

  const [existingCustomerWarning, setExistingCustomerWarning] = useState<Customer | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePhoneBlur = () => {
    if (!phone.trim()) {
      setExistingCustomerWarning(null);
      return;
    }
    const existing = NuedeStore.findCustomerByPhone(phone);
    if (existing) {
      setExistingCustomerWarning(existing);
    } else {
      setExistingCustomerWarning(null);
    }
  };

  const handleUseExisting = () => {
    if (existingCustomerWarning) {
      onCustomerCreated(existingCustomerWarning);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Check deduplication
    const existing = NuedeStore.findCustomerByPhone(phone);
    if (existing) {
      setExistingCustomerWarning(existing);
      showToast('A customer with this phone number already exists', 'error');
      return;
    }

    const customer = NuedeStore.findOrCreateCustomer(
      firstName.trim(),
      lastName.trim(),
      phone.trim(),
      source,
      email.trim() || null,
      addressLine1.trim()
        ? {
            addressLine1: addressLine1.trim(),
            city: city.trim(),
            state: state.trim(),
            landmark: landmark.trim() || null,
          }
        : null
    );

    if (notes.trim()) {
      customer.notes = notes.trim();
      NuedeStore.saveCustomer(customer);
    }

    showToast(`Customer ${customer.firstName} ${customer.lastName} registered!`, 'success');
    onCustomerCreated(customer);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title="Register New Customer">
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-xs text-[#666666] -mt-2">
          Add customers from WhatsApp, Instagram, phone calls, or physical walk-ins into the central database.
        </p>

        {/* Existing duplicate detection warning */}
        {existingCustomerWarning && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Customer Record Already Exists (Phone Match)</span>
            </div>
            <p>
              <strong>
                {existingCustomerWarning.firstName} {existingCustomerWarning.lastName}
              </strong>{' '}
              is already registered ({existingCustomerWarning.phone}, Source:{' '}
              {existingCustomerWarning.source}).
            </p>
            <div className="pt-1">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleUseExisting}
              >
                Use Existing Record Instead
              </Button>
            </div>
          </div>
        )}

        {/* Basic Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="e.g. Babatunde"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
            required
          />
          <Input
            label="Last Name"
            placeholder="e.g. Williams"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Phone Number (Key Lookup)"
            placeholder="e.g. 0812 987 6543"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setExistingCustomerWarning(null);
            }}
            onBlur={handlePhoneBlur}
            error={errors.phone}
            required
            helperText="Auto-deduplicated"
          />

          <Input
            label="Email (Optional)"
            placeholder="e.g. customer@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Select
            label="Acquisition Source"
            value={source}
            onChange={(e) => setSource(e.target.value as OrderSource)}
            options={[
              { value: 'whatsapp', label: 'WhatsApp Chat' },
              { value: 'instagram', label: 'Instagram DM' },
              { value: 'phone', label: 'Phone Call' },
              { value: 'walk_in', label: 'Walk-in / In-person' },
              { value: 'website', label: 'Website' },
              { value: 'other', label: 'Other Channel' },
            ]}
          />
        </div>

        {/* Default Delivery Address */}
        <div className="space-y-3 pt-2 border-t border-[#E5E5E5]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
            Default Delivery Address (Optional)
          </h4>
          <Input
            label="Street Address / Building Number"
            placeholder="e.g. Flat 4B, Oceanview Towers, Victoria Island"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Area / Neighborhood"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={[
                { value: 'Lekki Phase 1', label: 'Lekki Phase 1' },
                { value: 'Victoria Island', label: 'Victoria Island' },
                { value: 'Ikoyi', label: 'Ikoyi' },
                { value: 'Oniru', label: 'Oniru' },
                { value: 'Ikeja GRA', label: 'Ikeja GRA' },
                { value: 'Yaba / Surulere', label: 'Yaba / Surulere' },
                { value: 'Abuja Central', label: 'Abuja Central' },
              ]}
            />
            <Select
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              options={[
                { value: 'Lagos', label: 'Lagos' },
                { value: 'Abuja FCT', label: 'Abuja FCT' },
                { value: 'Rivers', label: 'Port Harcourt' },
              ]}
            />
            <Input
              label="Landmark"
              placeholder="e.g. Near Eko Hotel"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>
        </div>

        {/* Internal Staff Notes */}
        <div className="space-y-1.5 pt-2 border-t border-[#E5E5E5]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
            Internal Staff Notes (Optional)
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2 text-xs text-[#1A1A1A] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#096E21]"
            placeholder="e.g. VIP client referred by Ade / Prefers low pepper seasoning"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Save Customer
          </Button>
        </div>
      </form>
    </Modal>
  );
};
