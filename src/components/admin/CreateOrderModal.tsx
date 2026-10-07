import React, { useState } from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { NuedeStore, normalizePhone } from '@/src/services/store';
import { Customer, MealPlan, Order, OrderSource, PaymentStatus, OrderStatus } from '@/src/types';
import { useToast } from '@/src/components/ui/Toast';
import {
  Search,
  UserCheck,
  UserPlus,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  UtensilsCrossed,
} from 'lucide-react';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
  initialCustomer?: Customer | null;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
  initialCustomer = null,
}) => {
  const { showToast } = useToast();
  const mealPlans = NuedeStore.getActiveMealPlans();
  const allCustomers = NuedeStore.getCustomers();

  // Search or select customer
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(initialCustomer);
  const [isCreatingNewCustomerInline, setIsCreatingNewCustomerInline] = useState(false);

  // New inline customer fields
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Order Details
  const [selectedPlanId, setSelectedPlanId] = useState<string>(mealPlans[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [orderSource, setOrderSource] = useState<OrderSource>('whatsapp');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('successful');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('preparing');
  const [deliveryFee, setDeliveryFee] = useState<number>(2000);
  const [notes, setNotes] = useState('');

  // Delivery Address
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('Lekki Phase 1');
  const [state, setState] = useState('Lagos');
  const [landmark, setLandmark] = useState('');

  // Created order modal state (to show generated code)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Update address when customer is selected
  const handleSelectCustomer = (cust: Customer) => {
    setSelectedCustomer(cust);
    if (cust.defaultAddress) {
      setAddressLine1(cust.defaultAddress.addressLine1 || '');
      setCity(cust.defaultAddress.city || 'Lekki Phase 1');
      setState(cust.defaultAddress.state || 'Lagos');
      setLandmark(cust.defaultAddress.landmark || '');
    }
  };

  const filteredCustomers = allCustomers.filter((c) => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  const selectedPlan = mealPlans.find((p) => p.id === selectedPlanId) || mealPlans[0];
  const subtotal = (selectedPlan?.price || 0) * quantity;
  const totalAmount = subtotal + deliveryFee;

  const handleCopyGeneratedCode = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.orderCode);
      setCodeCopied(true);
      showToast(`Order Code ${createdOrder.orderCode} copied!`, 'success');
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let targetCustomer = selectedCustomer;

    // If staff is creating customer inline
    if (isCreatingNewCustomerInline) {
      if (!newFirstName.trim() || !newLastName.trim() || !newPhone.trim()) {
        showToast('Please enter customer first name, last name, and phone', 'error');
        return;
      }
      targetCustomer = NuedeStore.findOrCreateCustomer(
        newFirstName.trim(),
        newLastName.trim(),
        newPhone.trim(),
        orderSource,
        newEmail.trim() || null,
        {
          addressLine1: addressLine1.trim(),
          city: city.trim(),
          state: state.trim(),
          landmark: landmark.trim() || null,
        }
      );
    }

    if (!targetCustomer) {
      showToast('Please select or create a customer first', 'error');
      return;
    }

    if (!selectedPlan) {
      showToast('Please select an active meal plan', 'error');
      return;
    }

    if (!addressLine1.trim()) {
      showToast('Please enter the delivery street address', 'error');
      return;
    }

    const { order } = NuedeStore.createOrder({
      customer: targetCustomer,
      mealPlan: selectedPlan,
      quantity,
      deliveryAddress: {
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        landmark: landmark.trim() || null,
      },
      source: orderSource,
      paymentStatus,
      orderStatus,
      deliveryFee,
      notes: notes.trim() || null,
    });

    setCreatedOrder(order);
    onOrderCreated(order);
    showToast(`Order ${order.orderCode} created successfully!`, 'success');
  };

  // If order was created, show the code sharing screen
  if (createdOrder) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title="Order Created Successfully">
        <div className="space-y-6 text-center py-2">
          <div className="w-14 h-14 rounded-full bg-[#096E21]/15 text-[#096E21] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold font-heading text-[#1A1A1A]">
              Unique Order Code Generated
            </h3>
            <p className="text-xs text-[#666666]">
              Send this code to the customer so they can verify receipt upon food delivery.
            </p>
          </div>

          {/* Copyable Code Badge */}
          <div className="p-5 rounded-2xl bg-[#FEF2A3]/40 border-2 border-[#096E21] space-y-3">
            <div className="font-mono text-3xl font-extrabold text-[#096E21] tracking-wider">
              {createdOrder.orderCode}
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={handleCopyGeneratedCode}
              leftIcon={codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {codeCopied ? 'Code Copied' : 'Copy Code for WhatsApp / SMS'}
            </Button>
          </div>

          {/* Order Snapshot Summary */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#666666]">Customer:</span>
              <strong className="text-[#1A1A1A]">
                {createdOrder.customerSnapshot.firstName} {createdOrder.customerSnapshot.lastName} ({createdOrder.customerSnapshot.phone})
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Meal Plan:</span>
              <span>{createdOrder.mealPlanSnapshot.name} ({createdOrder.quantity}x)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Order Source:</span>
              <span className="capitalize font-semibold text-[#096E21]">{createdOrder.source}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Payment Status:</span>
              <span className="capitalize font-semibold text-[#096E21]">{createdOrder.paymentStatus}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#E5E5E5] font-bold">
              <span>Total Amount:</span>
              <span className="text-[#096E21]">₦{createdOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <Button
            size="md"
            variant="secondary"
            className="w-full justify-center"
            onClick={onClose}
          >
            Done & Return
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" title="Create Manual Multi-Channel Order">
      <form onSubmit={handleCreateOrder} className="space-y-6">
        <p className="text-xs text-[#666666] -mt-2">
          Record customer orders received via WhatsApp, Instagram, Phone calls, or Walk-ins into the central database.
        </p>

        {/* Step 1: Select or Create Customer */}
        <div className="space-y-3 p-4 rounded-xl bg-neutral-50/70 border border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#096E21] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              <span>1. Customer Selection</span>
            </span>

            <button
              type="button"
              onClick={() => {
                setIsCreatingNewCustomerInline(!isCreatingNewCustomerInline);
                setSelectedCustomer(null);
              }}
              className="text-xs font-semibold text-[#096E21] hover:underline cursor-pointer"
            >
              {isCreatingNewCustomerInline ? '← Search Existing Customers' : '+ New Customer'}
            </button>
          </div>

          {!isCreatingNewCustomerInline ? (
            <div className="space-y-2">
              {selectedCustomer ? (
                <div className="p-3 bg-white rounded-lg border border-[#096E21] flex items-center justify-between">
                  <div className="text-xs">
                    <div className="font-bold text-sm text-[#1A1A1A]">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </div>
                    <div className="text-[#666666]">
                      Phone: <strong className="text-[#096E21]">{selectedCustomer.phone}</strong> · Source: {selectedCustomer.source}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Search customer by name or phone..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                  <div className="max-h-36 overflow-y-auto border border-[#E5E5E5] rounded-lg bg-white divide-y divide-neutral-100">
                    {filteredCustomers.length === 0 ? (
                      <div className="p-3 text-center text-xs text-[#666666]">
                        No matching customer found.{' '}
                        <button
                          type="button"
                          onClick={() => setIsCreatingNewCustomerInline(true)}
                          className="text-[#096E21] font-semibold underline"
                        >
                          Create customer now
                        </button>
                      </div>
                    ) : (
                      filteredCustomers.map((cust) => (
                        <div
                          key={cust.id}
                          onClick={() => handleSelectCustomer(cust)}
                          className="p-2.5 hover:bg-neutral-50 flex items-center justify-between cursor-pointer text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#1A1A1A]">
                              {cust.firstName} {cust.lastName}
                            </span>{' '}
                            <span className="text-[#666666]">({cust.phone})</span>
                          </div>
                          <span className="text-[11px] text-[#096E21] font-medium uppercase">
                            Select
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Inline new customer inputs */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <Input
                label="First Name"
                placeholder="e.g. Mary"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                placeholder="e.g. James"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                placeholder="0800 000 0000"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />
            </div>
          )}
        </div>

        {/* Step 2: Meal Plan & Order Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Select Meal Plan"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            options={mealPlans.map((mp) => ({
              value: mp.id,
              label: `${mp.name} (₦${mp.price.toLocaleString()})`,
            }))}
          />

          <Input
            label="Quantity"
            type="number"
            min={1}
            max={20}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            required
          />

          <Select
            label="Order Channel Source"
            value={orderSource}
            onChange={(e) => setOrderSource(e.target.value as OrderSource)}
            options={[
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'phone', label: 'Phone Call' },
              { value: 'walk_in', label: 'Walk-in / Cash' },
              { value: 'website', label: 'Website' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </div>

        {/* Step 3: Payment & Initial Order Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            options={[
              { value: 'successful', label: 'Successful (Paid)' },
              { value: 'pending', label: 'Pending Payment' },
              { value: 'failed', label: 'Failed' },
            ]}
          />

          <Select
            label="Initial Order Status"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
            options={[
              { value: 'preparing', label: 'Preparing (Kitchen)' },
              { value: 'pending', label: 'Pending' },
              { value: 'ready', label: 'Ready for Dispatch' },
              { value: 'assigned', label: 'Assigned to Rider' },
            ]}
          />

          <Input
            label="Delivery Fee (₦)"
            type="number"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Step 4: Delivery Destination */}
        <div className="space-y-3 pt-2 border-t border-[#E5E5E5]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
            Delivery Address
          </h4>
          <Input
            label="Street Address / Building"
            placeholder="e.g. Plot 22, Glover Road"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
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
              placeholder="e.g. Near French School"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>
        </div>

        {/* Total Price Bar */}
        <div className="p-4 rounded-xl bg-[#FEF2A3]/30 border border-[#FEF2A3] flex items-center justify-between text-xs">
          <div>
            <span className="text-[#666666]">Subtotal: ₦{subtotal.toLocaleString()} + Delivery: ₦{deliveryFee.toLocaleString()}</span>
            <div className="text-lg font-bold text-[#096E21] font-sans">
              Total: ₦{totalAmount.toLocaleString()}
            </div>
          </div>
          <div className="text-right text-[11px] text-[#666666]">
            Server will generate unique Order Code upon submit
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Order & Generate Code
          </Button>
        </div>
      </form>
    </Modal>
  );
};
