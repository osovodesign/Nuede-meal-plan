import React, { useState } from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { CheckoutFormData } from '@/src/components/public/Checkout';
import { PaymentService, PaymentVerificationResult } from '@/src/services/paymentService';
import { useToast } from '@/src/components/ui/Toast';
import {
  CreditCard,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutData: CheckoutFormData | null;
  onPaymentSuccess: (result: PaymentVerificationResult) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  checkoutData,
  onPaymentSuccess,
}) => {
  const { showToast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Card input states
  const [cardNumber, setCardNumber] = useState('4084 0848 1024 8192');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('812');

  if (!checkoutData) return null;

  const { plan, totalAmount, firstName, lastName, phone, email, address, quantity } =
    checkoutData;

  const handleProcessPayment = (simulateSuccess: boolean) => {
    setIsProcessing(true);
    setPaymentError(null);

    // Simulate real gateway network latency & server-side verification
    setTimeout(() => {
      if (!simulateSuccess) {
        setIsProcessing(false);
        setPaymentError('The bank declined the payment. Please try another card or use Bank Transfer.');
        showToast('Payment was not completed. Please try again.', 'error');
        return;
      }

      // Generate server reference and verify server-side
      const reference = PaymentService.generatePaymentReference();

      const verification = PaymentService.verifyPaymentAndCreateOrder({
        reference,
        paidAmount: totalAmount,
        channel: selectedChannel,
        initParams: {
          mealPlanId: plan.id,
          quantity,
          firstName,
          lastName,
          phone,
          email,
          address,
          source: 'website',
        },
      });

      setIsProcessing(false);

      if (verification.success && verification.order) {
        showToast('Payment confirmed! Order created successfully.', 'success');
        onPaymentSuccess(verification);
        onClose();
      } else {
        setPaymentError(verification.message || 'Payment verification failed.');
        showToast(verification.message || 'Verification failed.', 'error');
      }
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="space-y-6">
        {/* Gateway Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#096E21] text-white flex items-center justify-center font-bold text-sm">
              N
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1A1A1A]">
                Nuede Checkout Checkout
              </h3>
              <p className="text-[11px] text-[#666666]">
                {email || `${phone}@nuede.com`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#666666] block">Pay Total</span>
            <span className="text-lg font-bold text-[#096E21] font-sans">
              ₦{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Channel Selection Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'card', label: 'Debit Card', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'transfer', label: 'Transfer', icon: <Building2 className="w-4 h-4" /> },
            { id: 'ussd', label: 'USSD', icon: <Phone className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedChannel(tab.id as any);
                setPaymentError(null);
              }}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                selectedChannel === tab.id
                  ? 'border-[#096E21] bg-[#096E21]/5 text-[#096E21]'
                  : 'border-[#E5E5E5] bg-white text-[#666666] hover:bg-neutral-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Channel Details */}
        {selectedChannel === 'card' && (
          <div className="space-y-4">
            <Input
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              leftIcon={<CreditCard className="w-4 h-4" />}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Card Expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
              />
              <Input
                label="CVV"
                type="password"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
              />
            </div>
          </div>
        )}

        {selectedChannel === 'transfer' && (
          <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] space-y-3 text-xs">
            <div className="flex items-center justify-between text-[#666666]">
              <span>Bank Name</span>
              <span className="font-bold text-[#1A1A1A]">Titan Trust Bank / Paystack</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#096E21]">
                  9938210492
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('9938210492');
                    showToast('Account number copied to clipboard', 'info');
                  }}
                  className="text-neutral-400 hover:text-neutral-700 p-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-[#666666] pt-1 border-t border-[#E5E5E5]">
              <span>Expires In</span>
              <span className="text-amber-600 font-semibold">29 minutes</span>
            </div>
            <p className="text-[11px] text-[#666666] leading-relaxed pt-1">
              Transfer exactly <strong className="text-[#1A1A1A]">₦{totalAmount.toLocaleString()}</strong>. Your order will be automatically verified once your transfer is received.
            </p>
          </div>
        )}

        {selectedChannel === 'ussd' && (
          <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] space-y-3 text-xs">
            <p className="text-[#666666]">
              Dial the code below on your registered bank mobile phone to authorize this payment:
            </p>
            <div className="p-3 bg-white rounded-lg border border-[#E5E5E5] text-center font-mono font-bold text-sm text-[#096E21]">
              *737*50*{totalAmount}*0492#
            </div>
          </div>
        )}

        {/* Error notice if failed */}
        {paymentError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <strong className="block">Payment Failed</strong>
              <span>{paymentError}</span>
            </div>
          </div>
        )}

        {/* Action Button & Gateway Simulators */}
        <div className="space-y-3 pt-2">
          <Button
            size="lg"
            variant="primary"
            className="w-full justify-center shadow-xs"
            isLoading={isProcessing}
            onClick={() => handleProcessPayment(true)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isProcessing ? 'Verifying with Bank...' : `Pay ₦${totalAmount.toLocaleString()}`}
          </Button>

          {/* Test Controls */}
          <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#666666]">
            <span>Test Simulation:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleProcessPayment(false)}
                disabled={isProcessing}
                className="text-rose-600 hover:underline cursor-pointer"
              >
                Simulate Failure
              </button>
            </div>
          </div>
        </div>

        {/* Security footer */}
        <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-center gap-2 text-[11px] text-[#666666]">
          <Lock className="w-3.5 h-3.5 text-[#096E21]" />
          <span>Secured by Paystack 256-bit AES encryption. PCI-DSS compliant.</span>
        </div>
      </div>
    </Modal>
  );
};
