/**
 * Data contracts and TypeScript interfaces for Nuede Meal Plan & Delivery Platform
 * Conforming strictly to 04_DATABASE_SCHEMA.md
 */

export type OrderSource =
  | 'website'
  | 'whatsapp'
  | 'instagram'
  | 'phone'
  | 'walk_in'
  | 'other';

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'customer_confirmed'
  | 'failed'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'successful'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type DeliveryStatus =
  | 'pending'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export interface CustomerAddress {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  landmark?: string | null;
  deliveryInstructions?: string | null;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  source: OrderSource;
  defaultAddress?: CustomerAddress | null;
  notes?: string | null;
  isActive: boolean;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface CustomerSnapshot {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
}

export interface MealPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in NGN (Naira)
  currency: 'NGN';
  duration: number; // e.g. 7
  durationUnit: 'days' | 'weeks' | 'months';
  mealCount: number; // e.g. 14 meals
  imageUrl?: string;
  highlights: string[];
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MealPlanSnapshot {
  name: string;
  price: number;
  duration: number;
  durationUnit: string;
  mealCount: number;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. "MP-48291"
  customerId: string;
  mealPlanId: string;
  mealPlanSnapshot: MealPlanSnapshot;
  source: OrderSource;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  currency: 'NGN';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryId?: string | null;
  paymentId?: string | null;
  deliveryAddress: CustomerAddress;
  customerSnapshot: CustomerSnapshot;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  provider: 'paystack' | 'manual' | 'bank_transfer';
  providerReference: string;
  amount: number;
  currency: 'NGN';
  status: PaymentStatus;
  channel?: string;
  paidAt?: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerId: string;
  deliveryPersonnelId?: string | null;
  address: CustomerAddress;
  status: DeliveryStatus;
  assignedAt?: string | null;
  outForDeliveryAt?: string | null;
  deliveredAt?: string | null;
  failedAt?: string | null;
  failureReason?: string | null;
  deliveryNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryPersonnel {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  vehicleType?: 'Motorcycle' | 'Bicycle' | 'Van' | 'Car';
  vehicleNumber?: string | null;
  isActive: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryConfirmation {
  id: string;
  orderId: string;
  customerId: string;
  orderCode: string;
  confirmedAt: string;
  confirmationMethod: 'order_code';
  ipHash?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'operations';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface SystemSettings {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  defaultDeliveryFee: number;
  supportedCities: string[];
}
