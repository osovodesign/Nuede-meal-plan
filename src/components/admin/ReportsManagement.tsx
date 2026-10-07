import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { NuedeStore } from '@/src/services/store';
import { Order, OrderSource, MealPlan } from '@/src/types';
import { useToast } from '@/src/components/ui/Toast';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Share2,
} from 'lucide-react';

export const ReportsManagement: React.FC = () => {
  const { showToast } = useToast();
  const orders = NuedeStore.getOrders();
  const customers = NuedeStore.getCustomers();
  const mealPlans = NuedeStore.getMealPlans();
  const confirmations = NuedeStore.getConfirmations();

  // Metrics computation
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'successful')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const deliveredOrdersCount = orders.filter(
    (o) => o.orderStatus === 'delivered' || o.orderStatus === 'customer_confirmed'
  ).length;

  const confirmedOrdersCount = orders.filter(
    (o) => o.orderStatus === 'customer_confirmed'
  ).length;

  const confirmationRate = deliveredOrdersCount > 0
    ? Math.round((confirmedOrdersCount / deliveredOrdersCount) * 100)
    : 100;

  // Breakdown by channel source
  const sources: OrderSource[] = ['website', 'whatsapp', 'instagram', 'phone', 'walk_in', 'other'];
  const sourceStats = sources.map((source) => {
    const matching = orders.filter((o) => o.source === source);
    const count = matching.length;
    const revenue = matching
      .filter((o) => o.paymentStatus === 'successful')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
    return {
      source,
      label: source.charAt(0).toUpperCase() + source.slice(1).replace('_', ' '),
      count,
      revenue,
      percentage,
    };
  }).filter((s) => s.count > 0 || ['website', 'whatsapp', 'instagram'].includes(s.source));

  // Breakdown by Meal Plan
  const planStats = mealPlans.map((plan) => {
    const matching = orders.filter((o) => o.mealPlanId === plan.id);
    const count = matching.reduce((sum, o) => sum + o.quantity, 0);
    const revenue = matching
      .filter((o) => o.paymentStatus === 'successful')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      name: plan.name,
      count,
      revenue,
    };
  });

  const handlePrint = () => {
    window.print();
    showToast('Printing operational report summary', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1A1A]">
            Operational Reports & Metrics
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Real-time business performance across website sales, social channels, and delivery fulfillment.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print / Export Report
        </Button>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-2 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between text-xs text-[#666666]">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#096E21]" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#096E21]">
            ₦{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#666666]">
            Verified Net Sales
          </div>
        </Card>

        <Card className="p-4 space-y-2 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between text-xs text-[#666666]">
            <span>Total Subscriptions</span>
            <ShoppingBag className="w-4 h-4 text-[#096E21]" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#1A1A1A]">
            {totalOrders}
          </div>
          <div className="text-[11px] text-[#096E21] font-medium">
            All Channels Combined
          </div>
        </Card>

        <Card className="p-4 space-y-2 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between text-xs text-[#666666]">
            <span>Delivery Confirmation</span>
            <CheckCircle2 className="w-4 h-4 text-[#096E21]" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#096E21]">
            {confirmationRate}%
          </div>
          <div className="text-[11px] text-[#666666]">
            {confirmedOrdersCount} of {deliveredOrdersCount} verified by customers
          </div>
        </Card>

        <Card className="p-4 space-y-2 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between text-xs text-[#666666]">
            <span>Active Customers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#1A1A1A]">
            {customers.length}
          </div>
          <div className="text-[11px] text-[#666666]">
            Deduplicated Registry
          </div>
        </Card>
      </div>

      {/* Grid: Channel Source Breakdown & Popular Meal Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders & Revenue by Acquisition Channel */}
        <Card className="space-y-4 p-5 bg-white border border-[#E5E5E5] shadow-xs">
          <div className="border-b border-[#E5E5E5] pb-3">
            <h3 className="font-bold text-base font-heading text-[#1A1A1A]">
              Orders by Acquisition Channel
            </h3>
            <p className="text-xs text-[#666666]">
              Volume and revenue comparison across Website, WhatsApp, and Instagram.
            </p>
          </div>

          <div className="space-y-4">
            {sourceStats.map((stat) => (
              <div key={stat.source} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1A]">{stat.label}</span>
                    <span className="text-[11px] text-[#666666]">
                      ({stat.count} orders · {stat.percentage}%)
                    </span>
                  </div>
                  <span className="font-bold text-[#096E21]">
                    ₦{stat.revenue.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-[#096E21] rounded-full transition-all"
                    style={{ width: `${Math.max(5, stat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] text-[11px] text-[#666666] leading-relaxed">
            Centralized database architecture ensures all channels share the exact same order model and order codes.
          </div>
        </Card>

        {/* Meal Plan Popularity & Revenue */}
        <Card className="space-y-4 p-5 bg-white border border-[#E5E5E5] shadow-xs">
          <div className="border-b border-[#E5E5E5] pb-3">
            <h3 className="font-bold text-base font-heading text-[#1A1A1A]">
              Meal Plan Performance
            </h3>
            <p className="text-xs text-[#666666]">
              Top performing subscriptions and revenue contributions.
            </p>
          </div>

          <div className="divide-y divide-[#E5E5E5] text-xs">
            {planStats.map((plan, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1A1A1A] block">{plan.name}</span>
                  <span className="text-[#666666] text-[11px]">
                    {plan.count} total subscriptions sold
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#096E21] text-sm block">
                    ₦{plan.revenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#666666]">Verified Revenue</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Operational Delivery Accountability Report */}
      <Card className="p-5 bg-white border border-[#E5E5E5] shadow-xs space-y-4">
        <div className="border-b border-[#E5E5E5] pb-3">
          <h3 className="font-bold text-base font-heading text-[#1A1A1A]">
            Delivery Accountability & Audit Log
          </h3>
          <p className="text-xs text-[#666666]">
            Verifications confirmed via customer order codes on the public confirmation portal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5] space-y-1">
            <span className="text-[#666666]">Delivered Packages</span>
            <div className="text-xl font-bold text-[#1A1A1A]">{deliveredOrdersCount}</div>
            <p className="text-[11px] text-[#666666]">Dispatched to customers</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-emerald-900">
            <span className="text-emerald-700">Customer Confirmed</span>
            <div className="text-xl font-bold text-[#096E21]">{confirmedOrdersCount}</div>
            <p className="text-[11px] text-emerald-700">Code verified in system</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-amber-900">
            <span className="text-amber-700">Awaiting Code Confirmation</span>
            <div className="text-xl font-bold text-amber-800">
              {Math.max(0, deliveredOrdersCount - confirmedOrdersCount)}
            </div>
            <p className="text-[11px] text-amber-700">Food delivered, customer pending code entry</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
