import React, { useState, useEffect } from 'react';
import { Header } from '@/src/components/common/Header';
import { Footer } from '@/src/components/common/Footer';
import { Hero } from '@/src/components/public/Hero';
import { HowItWorks } from '@/src/components/public/HowItWorks';
import { WhyChooseUs } from '@/src/components/public/WhyChooseUs';
import { MealPlanCatalog } from '@/src/components/public/MealPlanCatalog';
import { MealPlanDetailModal } from '@/src/components/public/MealPlanDetailModal';
import { Checkout, CheckoutFormData } from '@/src/components/public/Checkout';
import { PaymentModal } from '@/src/components/public/PaymentModal';
import { OrderConfirmation } from '@/src/components/public/OrderConfirmation';
import { ConfirmDeliveryPage } from '@/src/components/public/ConfirmDeliveryPage';
import { AdminLogin } from '@/src/components/admin/AdminLogin';
import { AdminShell } from '@/src/components/admin/AdminShell';
import { AdminDashboard } from '@/src/components/admin/AdminDashboard';
import { CustomerManagement } from '@/src/components/admin/CustomerManagement';
import { OrderManagement } from '@/src/components/admin/OrderManagement';
import { MealPlanManagement } from '@/src/components/admin/MealPlanManagement';
import { DeliveryManagement } from '@/src/components/admin/DeliveryManagement';
import { PersonnelManagement } from '@/src/components/admin/PersonnelManagement';
import { ReportsManagement } from '@/src/components/admin/ReportsManagement';
import { SecurityHardeningPanel } from '@/src/components/admin/SecurityHardeningPanel';
import { ToastProvider, useToast } from '@/src/components/ui/Toast';
import { Button } from '@/src/components/ui/Button';
import { MealPlan, Order, AdminUser } from '@/src/types';
import { NuedeStore } from '@/src/services/store';
import { PaymentVerificationResult } from '@/src/services/paymentService';
import { ArrowRight, CheckSquare, UtensilsCrossed } from 'lucide-react';

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [adminSection, setAdminSection] = useState<string>('overview');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    return NuedeStore.getAdminSession();
  });

  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<MealPlan | null>(null);
  const [activeCheckoutPlan, setActiveCheckoutPlan] = useState<MealPlan | null>(() => {
    return NuedeStore.getActiveMealPlans()[0] || null;
  });
  const [activeCheckoutData, setActiveCheckoutData] = useState<CheckoutFormData | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(() => {
    return NuedeStore.getOrders()[0] || null;
  });

  const [prefilledOrderCode, setPrefilledOrderCode] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    const handleHash = () => {
      const fullHash = window.location.hash.replace('#/', '').replace('#', '');
      if (fullHash.startsWith('order/')) {
        const code = fullHash.replace('order/', '');
        const order = NuedeStore.getOrderByCode(code);
        if (order) {
          setConfirmedOrder(order);
          setCurrentRoute('order-confirmation');
          return;
        }
      }
      if (fullHash.startsWith('admin')) {
        const parts = fullHash.split('/');
        setCurrentRoute('admin');
        if (parts[1]) setAdminSection(parts[1]);
        return;
      }
      if (fullHash) {
        setCurrentRoute(fullHash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlan = (plan: MealPlan) => {
    setActiveCheckoutPlan(plan);
    showToast(`Selected "${plan.name}"`, 'success');
    navigateTo('checkout');
  };

  const handleViewPlanDetails = (plan: MealPlan) => {
    setSelectedPlanForDetails(plan);
  };

  const handleProceedToPayment = (data: CheckoutFormData) => {
    setActiveCheckoutData(data);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (result: PaymentVerificationResult) => {
    if (result.order) {
      setConfirmedOrder(result.order);
      navigateTo(`order/${result.order.orderCode}`);
    }
  };

  const handleNavigateToConfirmDelivery = (orderCode: string) => {
    setPrefilledOrderCode(orderCode);
    navigateTo('confirm-delivery');
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setAdminSection('overview');
  };

  const handleAdminLogout = () => {
    NuedeStore.logoutAdmin();
    setAdminUser(null);
    showToast('Signed out from operations portal', 'info');
    navigateTo('home');
  };

  // If inside admin view
  if (currentRoute === 'admin') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToSite={() => navigateTo('home')}
        />
      );
    }

    return (
      <AdminShell
        adminUser={adminUser}
        currentSection={adminSection}
        onNavigateSection={(sec) => setAdminSection(sec)}
        onLogout={handleAdminLogout}
        onExitToWebsite={() => navigateTo('home')}
      >
        {adminSection === 'overview' && (
          <AdminDashboard
            onNavigateSection={(sec) => setAdminSection(sec)}
          />
        )}

        {adminSection === 'orders' && (
          <OrderManagement
            onAssignRiderClick={(ord) => {
              setAdminSection('deliveries');
            }}
          />
        )}

        {adminSection === 'customers' && (
          <CustomerManagement />
        )}

        {adminSection === 'meal-plans' && (
          <MealPlanManagement />
        )}

        {adminSection === 'deliveries' && (
          <DeliveryManagement />
        )}

        {adminSection === 'personnel' && (
          <PersonnelManagement />
        )}

        {adminSection === 'reports' && (
          <ReportsManagement />
        )}

        {adminSection === 'security' && (
          <SecurityHardeningPanel />
        )}
      </AdminShell>
    );
  }

  // Public customer view
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7] text-[#1A1A1A]">
      <Header currentRoute={currentRoute} onNavigate={navigateTo} />

      <main className="flex-1">
        {/* Route: Homepage */}
        {currentRoute === 'home' && (
          <div>
            <Hero
              onExplorePlans={() => navigateTo('meal-plans')}
              onConfirmDelivery={() => navigateTo('confirm-delivery')}
            />
            <MealPlanCatalog
              onSelectPlan={handleSelectPlan}
              onViewPlanDetails={handleViewPlanDetails}
            />
            <HowItWorks />
            <WhyChooseUs />

            {/* Bottom CTA Section */}
            <section className="py-16 bg-[#096E21] text-white">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
                  Ready to Eat Healthy Everyday Without Cooking?
                </h2>
                <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto font-body">
                  Choose your plan in under two minutes. No sign-up required. Your first chef-prepared box arrives tomorrow morning.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-[#FEF2A3] hover:bg-[#fff9c2] text-[#096E21] font-bold border-none"
                    onClick={() => navigateTo('meal-plans')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View All Meal Plans
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white/50 hover:bg-white/10"
                    onClick={() => navigateTo('confirm-delivery')}
                    leftIcon={<CheckSquare className="w-4 h-4" />}
                  >
                    Have An Order Code? Confirm Here
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Route: Meal Plans Catalog */}
        {currentRoute === 'meal-plans' && (
          <div className="py-4">
            <MealPlanCatalog
              onSelectPlan={handleSelectPlan}
              onViewPlanDetails={handleViewPlanDetails}
            />
          </div>
        )}

        {/* Route: How It Works */}
        {currentRoute === 'how-it-works' && (
          <div className="py-4">
            <HowItWorks />
            <WhyChooseUs />
          </div>
        )}

        {/* Route: Checkout */}
        {currentRoute === 'checkout' && (
          <div className="py-4">
            <Checkout
              plan={activeCheckoutPlan}
              onBackToPlans={() => navigateTo('meal-plans')}
              onProceedToPayment={handleProceedToPayment}
            />
          </div>
        )}

        {/* Route: Order Confirmation Screen */}
        {(currentRoute === 'order-confirmation' || currentRoute.startsWith('order/')) && (
          <div className="py-4">
            {confirmedOrder ? (
              <OrderConfirmation
                order={confirmedOrder}
                onNavigateHome={() => navigateTo('home')}
                onNavigateToConfirmDelivery={handleNavigateToConfirmDelivery}
              />
            ) : (
              <div className="max-w-md mx-auto text-center py-16 space-y-4">
                <h3 className="text-xl font-bold text-[#1A1A1A]">No Order Selected</h3>
                <Button variant="primary" onClick={() => navigateTo('meal-plans')}>
                  Browse Meal Plans
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Route: Public Customer Delivery Confirmation */}
        {currentRoute === 'confirm-delivery' && (
          <div className="py-4">
            <ConfirmDeliveryPage
              initialCode={prefilledOrderCode}
              onNavigateHome={() => navigateTo('home')}
            />
          </div>
        )}
      </main>

      {/* Plan Details Modal */}
      <MealPlanDetailModal
        plan={selectedPlanForDetails}
        isOpen={!!selectedPlanForDetails}
        onClose={() => setSelectedPlanForDetails(null)}
        onSelect={handleSelectPlan}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        checkoutData={activeCheckoutData}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
