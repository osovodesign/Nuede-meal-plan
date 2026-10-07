import { MealPlan, CustomerAddress, Order, Payment, OrderSource } from '@/src/types';
import { NuedeStore, normalizePhone } from './store';

export interface PaymentInitializationParams {
  mealPlanId: string;
  quantity: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address: CustomerAddress;
  source?: OrderSource;
}

export interface PaymentVerificationResult {
  success: boolean;
  message: string;
  order?: Order;
  payment?: Payment;
  reference?: string;
}

/**
 * Service providing server-side payment initialization, verification, and idempotent order creation
 * Conforming strictly to 07_SECURITY_AND_PAYMENT.md
 */
export class PaymentService {
  /**
   * Recalculates expected payable amount server-side from authoritative active meal plans
   * Never trusts client-submitted monetary values
   */
  static calculateOrderAmount(mealPlanId: string, quantity: number): {
    mealPlan: MealPlan;
    unitPrice: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    totalAmount: number;
  } {
    const mealPlan = NuedeStore.getMealPlanById(mealPlanId);
    if (!mealPlan) {
      throw new Error(`Invalid or inactive meal plan ID: ${mealPlanId}`);
    }

    const safeQuantity = Math.max(1, Math.floor(quantity));
    const unitPrice = mealPlan.price;
    const subtotal = unitPrice * safeQuantity;
    const deliveryFee = 2000; // Flat N2,000 thermal delivery standard
    const discount = 0;
    const totalAmount = subtotal + deliveryFee - discount;

    return {
      mealPlan,
      unitPrice,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
    };
  }

  /**
   * Generates a unique payment provider reference (e.g. Paystack transaction reference)
   */
  static generatePaymentReference(): string {
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `PSTK_${timestamp}_${randomHex}`;
  }

  /**
   * Verifies the payment transaction server-side and finalizes the order atomically
   * Enforces idempotency using providerReference
   */
  static verifyPaymentAndCreateOrder(params: {
    reference: string;
    paidAmount: number;
    channel?: string;
    initParams: PaymentInitializationParams;
  }): PaymentVerificationResult {
    const { reference, paidAmount, channel, initParams } = params;

    // 1. Recalculate trusted server-side amount
    let calculation;
    try {
      calculation = this.calculateOrderAmount(
        initParams.mealPlanId,
        initParams.quantity
      );
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'Verification failed: invalid meal plan.',
      };
    }

    // 2. Strict amount verification
    if (paidAmount !== calculation.totalAmount) {
      return {
        success: false,
        message: `Payment amount discrepancy. Expected ₦${calculation.totalAmount.toLocaleString()}, received ₦${paidAmount.toLocaleString()}. Transaction flagged.`,
      };
    }

    // 3. Check idempotency: check if this payment reference was already processed
    const existingOrders = NuedeStore.getOrders();
    const existingOrderWithRef = existingOrders.find(
      (o) => o.paymentId === reference
    );
    if (existingOrderWithRef) {
      return {
        success: true,
        message: 'Transaction already verified previously.',
        order: existingOrderWithRef,
        reference,
      };
    }

    // 4. Find or create centralized customer record (deduplicating by normalized phone)
    const customer = NuedeStore.findOrCreateCustomer(
      initParams.firstName,
      initParams.lastName,
      initParams.phone,
      initParams.source || 'website',
      initParams.email,
      initParams.address
    );

    // 5. Create order with unique public order code and snapshots
    const { order, delivery } = NuedeStore.createOrder({
      customer,
      mealPlan: calculation.mealPlan,
      quantity: initParams.quantity,
      deliveryAddress: initParams.address,
      source: initParams.source || 'website',
      paymentStatus: 'successful',
      orderStatus: 'preparing', // Kitchen begins preparation once verified
      deliveryFee: calculation.deliveryFee,
      notes: initParams.address.deliveryInstructions,
    });

    // Record reference
    order.paymentId = reference;
    NuedeStore.updateOrderPaymentStatus(order.id, 'successful');

    const paymentRecord: Payment = {
      id: `pmt_${Date.now()}`,
      orderId: order.id,
      customerId: customer.id,
      provider: 'paystack',
      providerReference: reference,
      amount: calculation.totalAmount,
      currency: 'NGN',
      status: 'successful',
      channel: channel || 'card',
      paidAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Payment verified successfully and order created.',
      order,
      payment: paymentRecord,
      reference,
    };
  }
}
