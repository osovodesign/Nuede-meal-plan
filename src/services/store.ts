import {
  Customer,
  MealPlan,
  Order,
  Payment,
  Delivery,
  DeliveryPersonnel,
  DeliveryConfirmation,
  SystemSettings,
  AdminUser,
} from '@/src/types';

// Initial pre-seeded Meal Plans as defined in PRD & Feature specs
export const INITIAL_MEAL_PLANS: MealPlan[] = [
  {
    id: 'mp_weekly_healthy',
    name: 'Weekly Healthy Balance',
    slug: 'weekly-healthy-balance',
    description:
      'Nutritious, chef-curated breakfast and lunch bowls packed with fresh vegetables, lean proteins, and complex grains.',
    price: 35000,
    currency: 'NGN',
    duration: 7,
    durationUnit: 'days',
    mealCount: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    highlights: [
      '14 Freshly Prepared Meals (Breakfast + Lunch)',
      'Zero refined sugars or preservatives',
      'Daily morning doorstep dispatch',
      'Portion-controlled & calorie balanced',
    ],
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mp_executive_gourmet',
    name: 'Executive Gourmet Diet',
    slug: 'executive-gourmet-diet',
    description:
      'Premium high-protein culinary dishes designed for busy executives, featuring grilled seafood, tender steaks, and vibrant microgreens.',
    price: 55000,
    currency: 'NGN',
    duration: 7,
    durationUnit: 'days',
    mealCount: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'High protein (40g+ per bowl) & keto-friendly options',
      'Signature gourmet sauces & chef specials',
      'Eco-friendly insulated thermal packaging',
      'Priority delivery time window',
    ],
    isActive: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mp_weight_watcher',
    name: 'Weight Watcher & Calorie Deficit',
    slug: 'weight-watcher-calorie-deficit',
    description:
      'Structured low-carb, nutrient-dense meal plan carefully measured between 400-500 kcal per meal to support healthy, sustained weight loss.',
    price: 38000,
    currency: 'NGN',
    duration: 7,
    durationUnit: 'days',
    mealCount: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Accurate macronutrient breakdown provided',
      'High fiber greens & lean poultry/fish',
      'Includes herbal detox cold-pressed booster drink',
      'Guaranteed freshness',
    ],
    isActive: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mp_monthly_fuel',
    name: 'Monthly Clean Fuel (Full Month)',
    slug: 'monthly-clean-fuel',
    description:
      'Comprehensive 30-day nutrition subscription covering 60 wholesome meals with weekly rotational menus so you never get bored.',
    price: 135000,
    currency: 'NGN',
    duration: 30,
    durationUnit: 'days',
    mealCount: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Best value: save over ₦15,000 compared to weekly',
      'Rotational menu across Nigerian & Continental flavors',
      'Pause or reschedule delivery days anytime',
      'Free weekend wellness fruit box',
    ],
    isActive: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Delivery Personnel
export const INITIAL_DELIVERY_PERSONNEL: DeliveryPersonnel[] = [
  {
    id: 'dp_tunde',
    firstName: 'Tunde',
    lastName: 'Adeleke',
    phone: '08023456781',
    email: 'tunde.adeleke@nuede.com',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'LND-429-XY',
    isActive: true,
    notes: 'Primary rider for Victoria Island & Ikoyi routes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dp_emeka',
    firstName: 'Emeka',
    lastName: 'Okafor',
    phone: '08139876542',
    email: 'emeka.okafor@nuede.com',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'KJA-812-AB',
    isActive: true,
    notes: 'Handles Lekki Phase 1 & Oniru deliveries',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dp_fatima',
    firstName: 'Fatima',
    lastName: 'Bello',
    phone: '09087654321',
    email: 'fatima.bello@nuede.com',
    vehicleType: 'Van',
    vehicleNumber: 'APP-104-CD',
    isActive: true,
    notes: 'Mainland bulk & corporate team packages',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Centralized Customers across channels
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_001',
    firstName: 'Chidinma',
    lastName: 'Nwachukwu',
    phone: '08031234567',
    email: 'chidinma.n@example.com',
    source: 'website',
    defaultAddress: {
      addressLine1: 'Plot 14, Admiralty Way, Lekki Phase 1',
      city: 'Lekki',
      state: 'Lagos',
      landmark: 'Beside Ebeano Supermarket',
      deliveryInstructions: 'Call upon arrival at the gate',
    },
    isActive: true,
    orderCount: 3,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cust_002',
    firstName: 'Babatunde',
    lastName: 'Williams',
    phone: '08129876543',
    email: 'babatunde.w@gmail.com',
    source: 'whatsapp',
    defaultAddress: {
      addressLine1: 'Flat 4B, Oceanview Towers, Victoria Island',
      city: 'Victoria Island',
      state: 'Lagos',
      landmark: 'Near Eko Hotel',
      deliveryInstructions: 'Leave with concierge if not available',
    },
    isActive: true,
    orderCount: 1,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cust_003',
    firstName: 'Kareem',
    lastName: 'Suleiman',
    phone: '09051122334',
    email: 'kareem.s@corp.ng',
    source: 'instagram',
    defaultAddress: {
      addressLine1: '24 Glover Road, Ikoyi',
      city: 'Ikoyi',
      state: 'Lagos',
      landmark: 'Opposite French Cultural Centre',
      deliveryInstructions: 'Ring bell on the right pillar',
    },
    isActive: true,
    orderCount: 1,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Orders representing full lifecycle
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order_001',
    orderCode: 'MP-48291',
    customerId: 'cust_001',
    mealPlanId: 'mp_weekly_healthy',
    mealPlanSnapshot: {
      name: 'Weekly Healthy Balance',
      price: 35000,
      duration: 7,
      durationUnit: 'days',
      mealCount: 14,
    },
    source: 'website',
    quantity: 1,
    unitPrice: 35000,
    subtotal: 35000,
    deliveryFee: 2000,
    discount: 0,
    totalAmount: 37000,
    currency: 'NGN',
    paymentStatus: 'successful',
    orderStatus: 'customer_confirmed',
    deliveryId: 'del_001',
    deliveryAddress: {
      addressLine1: 'Plot 14, Admiralty Way, Lekki Phase 1',
      city: 'Lekki',
      state: 'Lagos',
      landmark: 'Beside Ebeano Supermarket',
    },
    customerSnapshot: {
      firstName: 'Chidinma',
      lastName: 'Nwachukwu',
      phone: '08031234567',
      email: 'chidinma.n@example.com',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'order_002',
    orderCode: 'MP-59182',
    customerId: 'cust_002',
    mealPlanId: 'mp_executive_gourmet',
    mealPlanSnapshot: {
      name: 'Executive Gourmet Diet',
      price: 55000,
      duration: 7,
      durationUnit: 'days',
      mealCount: 14,
    },
    source: 'whatsapp',
    quantity: 1,
    unitPrice: 55000,
    subtotal: 55000,
    deliveryFee: 2500,
    discount: 0,
    totalAmount: 57500,
    currency: 'NGN',
    paymentStatus: 'successful',
    orderStatus: 'delivered', // Awaiting customer confirmation!
    deliveryId: 'del_002',
    deliveryAddress: {
      addressLine1: 'Flat 4B, Oceanview Towers, Victoria Island',
      city: 'Victoria Island',
      state: 'Lagos',
      landmark: 'Near Eko Hotel',
    },
    customerSnapshot: {
      firstName: 'Babatunde',
      lastName: 'Williams',
      phone: '08129876543',
      email: 'babatunde.w@gmail.com',
    },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'order_003',
    orderCode: 'MP-73820',
    customerId: 'cust_003',
    mealPlanId: 'mp_weight_watcher',
    mealPlanSnapshot: {
      name: 'Weight Watcher & Calorie Deficit',
      price: 38000,
      duration: 7,
      durationUnit: 'days',
      mealCount: 14,
    },
    source: 'instagram',
    quantity: 1,
    unitPrice: 38000,
    subtotal: 38000,
    deliveryFee: 2000,
    discount: 0,
    totalAmount: 40000,
    currency: 'NGN',
    paymentStatus: 'successful',
    orderStatus: 'out_for_delivery',
    deliveryId: 'del_003',
    deliveryAddress: {
      addressLine1: '24 Glover Road, Ikoyi',
      city: 'Ikoyi',
      state: 'Lagos',
      landmark: 'Opposite French Cultural Centre',
    },
    customerSnapshot: {
      firstName: 'Kareem',
      lastName: 'Suleiman',
      phone: '09051122334',
      email: 'kareem.s@corp.ng',
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Deliveries
export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'del_001',
    orderId: 'order_001',
    customerId: 'cust_001',
    deliveryPersonnelId: 'dp_tunde',
    address: INITIAL_ORDERS[0].deliveryAddress,
    status: 'delivered',
    assignedAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
    outForDeliveryAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
    deliveredAt: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'del_002',
    orderId: 'order_002',
    customerId: 'cust_002',
    deliveryPersonnelId: 'dp_emeka',
    address: INITIAL_ORDERS[1].deliveryAddress,
    status: 'delivered',
    assignedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    outForDeliveryAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    deliveredAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'del_003',
    orderId: 'order_003',
    customerId: 'cust_003',
    deliveryPersonnelId: 'dp_tunde',
    address: INITIAL_ORDERS[2].deliveryAddress,
    status: 'out_for_delivery',
    assignedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    outForDeliveryAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Confirmations
export const INITIAL_CONFIRMATIONS: DeliveryConfirmation[] = [
  {
    id: 'conf_001',
    orderId: 'order_001',
    customerId: 'cust_001',
    orderCode: 'MP-48291',
    confirmedAt: new Date(Date.now() - 86400000 * 2 + 9000000).toISOString(),
    confirmationMethod: 'order_code',
    createdAt: new Date(Date.now() - 86400000 * 2 + 9000000).toISOString(),
  },
];

export const INITIAL_SETTINGS: SystemSettings = {
  businessName: 'Nuede Fresh Foods',
  phone: '+234 812 000 NUEDE',
  email: 'orders@nuede.com',
  address: '14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
  defaultDeliveryFee: 2000,
  supportedCities: ['Lagos (Island & Mainland)', 'Abuja (Central)', 'Port Harcourt'],
};

export const INITIAL_ADMIN_USER: AdminUser = {
  uid: 'admin_demo_01',
  email: 'admin@nuede.com',
  displayName: 'Operations Director',
  role: 'super_admin',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Storage helpers ensuring browser storage sync with fallback
 */
const STORAGE_KEYS = {
  MEAL_PLANS: 'nuede_meal_plans',
  CUSTOMERS: 'nuede_customers',
  ORDERS: 'nuede_orders',
  DELIVERIES: 'nuede_deliveries',
  PERSONNEL: 'nuede_personnel',
  CONFIRMATIONS: 'nuede_confirmations',
  SETTINGS: 'nuede_settings',
  ADMIN_SESSION: 'nuede_admin_session',
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data) as T;
  } catch (e) {
    console.warn(`Error reading from storage key "${key}":`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing to storage key "${key}":`, e);
  }
}

/**
 * Normalizes phone numbers (removes spaces, dashes, handles 234 prefix)
 */
export function normalizePhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length === 13) {
    return '0' + digits.slice(3);
  }
  return digits;
}

/**
 * Generates an official, human-readable, readable unique order code
 * Format: MP-XXXXX (e.g. MP-48291)
 */
export function generateOrderCode(existingOrders: Order[]): string {
  const existingCodes = new Set(existingOrders.map((o) => o.orderCode.toUpperCase()));
  let code = '';
  do {
    // 5-digit cryptographically styled random numeric string
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    code = `MP-${randomNum}`;
  } while (existingCodes.has(code));
  return code;
}

/**
 * Main Centralized Database Store Service
 */
export class NuedeStore {
  // Meal Plans
  static getMealPlans(): MealPlan[] {
    return getStoredItem<MealPlan[]>(STORAGE_KEYS.MEAL_PLANS, INITIAL_MEAL_PLANS);
  }

  static getActiveMealPlans(): MealPlan[] {
    return this.getMealPlans().filter((mp) => mp.isActive);
  }

  static getMealPlanById(id: string): MealPlan | undefined {
    return this.getMealPlans().find((mp) => mp.id === id);
  }

  static getMealPlanBySlug(slug: string): MealPlan | undefined {
    return this.getMealPlans().find((mp) => mp.slug === slug);
  }

  static saveMealPlan(plan: MealPlan): void {
    const plans = this.getMealPlans();
    const index = plans.findIndex((p) => p.id === plan.id);
    if (index >= 0) {
      plans[index] = { ...plan, updatedAt: new Date().toISOString() };
    } else {
      plans.unshift({
        ...plan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setStoredItem(STORAGE_KEYS.MEAL_PLANS, plans);
  }

  // Customers
  static getCustomers(): Customer[] {
    return getStoredItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }

  static findCustomerByPhone(phone: string): Customer | undefined {
    const normalized = normalizePhone(phone);
    return this.getCustomers().find(
      (c) => normalizePhone(c.phone) === normalized
    );
  }

  static getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find((c) => c.id === id);
  }

  static findOrCreateCustomer(
    firstName: string,
    lastName: string,
    phone: string,
    source: Customer['source'],
    email?: string | null,
    defaultAddress?: Customer['defaultAddress']
  ): Customer {
    const existing = this.findCustomerByPhone(phone);
    if (existing) {
      // Update with latest address if provided
      const updated: Customer = {
        ...existing,
        firstName: firstName || existing.firstName,
        lastName: lastName || existing.lastName,
        email: email || existing.email,
        defaultAddress: defaultAddress || existing.defaultAddress,
        updatedAt: new Date().toISOString(),
      };
      this.saveCustomer(updated);
      return updated;
    }

    const newCustomer: Customer = {
      id: `cust_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: normalizePhone(phone),
      email: email?.trim() || null,
      source,
      defaultAddress: defaultAddress || null,
      isActive: true,
      orderCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const customers = this.getCustomers();
    customers.unshift(newCustomer);
    setStoredItem(STORAGE_KEYS.CUSTOMERS, customers);
    return newCustomer;
  }

  static saveCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === customer.id);
    if (index >= 0) {
      customers[index] = { ...customer, updatedAt: new Date().toISOString() };
    } else {
      customers.unshift({
        ...customer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setStoredItem(STORAGE_KEYS.CUSTOMERS, customers);
  }

  // Orders
  static getOrders(): Order[] {
    return getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  static getOrderByCode(code: string): Order | undefined {
    const normalized = code.trim().toUpperCase();
    return this.getOrders().find(
      (o) => o.orderCode.trim().toUpperCase() === normalized
    );
  }

  static getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  static getOrdersByCustomerId(customerId: string): Order[] {
    return this.getOrders().filter((o) => o.customerId === customerId);
  }

  static createOrder(params: {
    customer: Customer;
    mealPlan: MealPlan;
    quantity: number;
    deliveryAddress: Customer['defaultAddress'];
    source: Order['source'];
    paymentStatus?: Order['paymentStatus'];
    orderStatus?: Order['orderStatus'];
    deliveryFee?: number;
    notes?: string | null;
  }): { order: Order; delivery: Delivery } {
    const orders = this.getOrders();
    const orderCode = generateOrderCode(orders);

    const unitPrice = params.mealPlan.price;
    const subtotal = unitPrice * params.quantity;
    const deliveryFee = params.deliveryFee ?? 2000;
    const discount = 0;
    const totalAmount = subtotal + deliveryFee - discount;

    const orderId = `order_${Date.now()}`;
    const deliveryId = `del_${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      orderCode,
      customerId: params.customer.id,
      mealPlanId: params.mealPlan.id,
      mealPlanSnapshot: {
        name: params.mealPlan.name,
        price: params.mealPlan.price,
        duration: params.mealPlan.duration,
        durationUnit: params.mealPlan.durationUnit,
        mealCount: params.mealPlan.mealCount,
      },
      source: params.source,
      quantity: params.quantity,
      unitPrice,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      currency: 'NGN',
      paymentStatus: params.paymentStatus || 'successful',
      orderStatus: params.orderStatus || 'preparing',
      deliveryId,
      deliveryAddress: params.deliveryAddress!,
      customerSnapshot: {
        firstName: params.customer.firstName,
        lastName: params.customer.lastName,
        phone: params.customer.phone,
        email: params.customer.email,
      },
      notes: params.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newDelivery: Delivery = {
      id: deliveryId,
      orderId,
      customerId: params.customer.id,
      deliveryPersonnelId: null,
      address: params.deliveryAddress!,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    setStoredItem(STORAGE_KEYS.ORDERS, orders);

    const deliveries = this.getDeliveries();
    deliveries.unshift(newDelivery);
    setStoredItem(STORAGE_KEYS.DELIVERIES, deliveries);

    // Increment customer order count
    const customer = this.getCustomerById(params.customer.id);
    if (customer) {
      customer.orderCount = (customer.orderCount || 0) + 1;
      this.saveCustomer(customer);
    }

    return { order: newOrder, delivery: newDelivery };
  }

  static updateOrderStatus(orderId: string, newStatus: Order['orderStatus']): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();
    setStoredItem(STORAGE_KEYS.ORDERS, orders);

    // Sync delivery status if relevant
    if (order.deliveryId) {
      const deliveries = this.getDeliveries();
      const delivery = deliveries.find((d) => d.id === order.deliveryId);
      if (delivery) {
        if (newStatus === 'assigned') delivery.status = 'assigned';
        if (newStatus === 'out_for_delivery') {
          delivery.status = 'out_for_delivery';
          delivery.outForDeliveryAt = new Date().toISOString();
        }
        if (newStatus === 'delivered' || newStatus === 'customer_confirmed') {
          delivery.status = 'delivered';
          if (!delivery.deliveredAt) delivery.deliveredAt = new Date().toISOString();
        }
        if (newStatus === 'failed') {
          delivery.status = 'failed';
          delivery.failedAt = new Date().toISOString();
        }
        if (newStatus === 'cancelled') delivery.status = 'cancelled';
        setStoredItem(STORAGE_KEYS.DELIVERIES, deliveries);
      }
    }

    return order;
  }

  static updateOrderPaymentStatus(orderId: string, status: Order['paymentStatus']): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    order.paymentStatus = status;
    order.updatedAt = new Date().toISOString();
    setStoredItem(STORAGE_KEYS.ORDERS, orders);
    return order;
  }

  // Deliveries
  static getDeliveries(): Delivery[] {
    return getStoredItem<Delivery[]>(STORAGE_KEYS.DELIVERIES, INITIAL_DELIVERIES);
  }

  static assignDeliveryPersonnel(deliveryId: string, personnelId: string): Delivery | undefined {
    const deliveries = this.getDeliveries();
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (!delivery) return undefined;

    delivery.deliveryPersonnelId = personnelId;
    delivery.status = 'assigned';
    delivery.assignedAt = new Date().toISOString();
    delivery.updatedAt = new Date().toISOString();
    setStoredItem(STORAGE_KEYS.DELIVERIES, deliveries);

    // Update parent order
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === delivery.orderId);
    if (order && order.orderStatus === 'ready') {
      order.orderStatus = 'assigned';
      order.updatedAt = new Date().toISOString();
      setStoredItem(STORAGE_KEYS.ORDERS, orders);
    }

    return delivery;
  }

  // Delivery Personnel
  static getDeliveryPersonnel(): DeliveryPersonnel[] {
    return getStoredItem<DeliveryPersonnel[]>(
      STORAGE_KEYS.PERSONNEL,
      INITIAL_DELIVERY_PERSONNEL
    );
  }

  static saveDeliveryPersonnel(person: DeliveryPersonnel): void {
    const list = this.getDeliveryPersonnel();
    const index = list.findIndex((p) => p.id === person.id);
    if (index >= 0) {
      list[index] = { ...person, updatedAt: new Date().toISOString() };
    } else {
      list.push({
        ...person,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setStoredItem(STORAGE_KEYS.PERSONNEL, list);
  }

  // Customer Delivery Confirmation (Atomic & Idempotent)
  static getConfirmations(): DeliveryConfirmation[] {
    return getStoredItem<DeliveryConfirmation[]>(
      STORAGE_KEYS.CONFIRMATIONS,
      INITIAL_CONFIRMATIONS
    );
  }

  static confirmDelivery(orderCode: string): {
    success: boolean;
    message: string;
    order?: Order;
    confirmation?: DeliveryConfirmation;
  } {
    const order = this.getOrderByCode(orderCode);
    if (!order) {
      return {
        success: false,
        message: 'No order found with this order code. Please check and try again.',
      };
    }

    if (order.orderStatus === 'cancelled') {
      return {
        success: false,
        message: 'This order was cancelled and cannot be confirmed.',
      };
    }

    if (order.orderStatus === 'customer_confirmed') {
      return {
        success: true,
        message: 'This delivery was already confirmed previously.',
        order,
      };
    }

    // Check if delivery has reached eligible state (delivered or out_for_delivery)
    const eligibleStatuses: Order['orderStatus'][] = [
      'delivered',
      'out_for_delivery',
      'ready',
      'assigned',
      'preparing',
    ];
    if (!eligibleStatuses.includes(order.orderStatus)) {
      return {
        success: false,
        message:
          'This order has not reached the delivery stage yet. Please wait until your food arrives.',
      };
    }

    // Record confirmation
    const confirmations = this.getConfirmations();
    const existing = confirmations.find(
      (c) => c.orderCode.toUpperCase() === order.orderCode.toUpperCase()
    );

    let confirmationRecord = existing;
    if (!confirmationRecord) {
      confirmationRecord = {
        id: `conf_${Date.now()}`,
        orderId: order.id,
        customerId: order.customerId,
        orderCode: order.orderCode,
        confirmedAt: new Date().toISOString(),
        confirmationMethod: 'order_code',
        createdAt: new Date().toISOString(),
      };
      confirmations.unshift(confirmationRecord);
      setStoredItem(STORAGE_KEYS.CONFIRMATIONS, confirmations);
    }

    // Update order status
    order.orderStatus = 'customer_confirmed';
    order.updatedAt = new Date().toISOString();
    const orders = this.getOrders();
    const orderIdx = orders.findIndex((o) => o.id === order.id);
    if (orderIdx >= 0) orders[orderIdx] = order;
    setStoredItem(STORAGE_KEYS.ORDERS, orders);

    // Update delivery status
    if (order.deliveryId) {
      const deliveries = this.getDeliveries();
      const del = deliveries.find((d) => d.id === order.deliveryId);
      if (del) {
        del.status = 'delivered';
        if (!del.deliveredAt) del.deliveredAt = new Date().toISOString();
        del.updatedAt = new Date().toISOString();
        setStoredItem(STORAGE_KEYS.DELIVERIES, deliveries);
      }
    }

    return {
      success: true,
      message: 'Delivery confirmed successfully! Thank you for choosing Nuede.',
      order,
      confirmation: confirmationRecord,
    };
  }

  // Settings
  static getSettings(): SystemSettings {
    return getStoredItem<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  static saveSettings(settings: SystemSettings): void {
    setStoredItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // Admin Auth Session
  static getAdminSession(): AdminUser | null {
    return getStoredItem<AdminUser | null>(STORAGE_KEYS.ADMIN_SESSION, null);
  }

  static loginAdmin(email: string): AdminUser {
    const user: AdminUser = {
      uid: 'admin_session_' + Date.now(),
      email,
      displayName: 'Operations Admin',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    setStoredItem(STORAGE_KEYS.ADMIN_SESSION, user);
    return user;
  }

  static logoutAdmin(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  }
}
