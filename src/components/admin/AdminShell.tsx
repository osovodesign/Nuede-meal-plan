import React, { useState } from 'react';
import { Logo } from '@/src/components/common/Logo';
import { AdminUser } from '@/src/types';
import { Button } from '@/src/components/ui/Button';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  Truck,
  UserCheck,
  BarChart3,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

interface AdminShellProps {
  adminUser: AdminUser;
  currentSection: string;
  onNavigateSection: (section: string) => void;
  onLogout: () => void;
  onExitToWebsite: () => void;
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  adminUser,
  currentSection,
  onNavigateSection,
  onLogout,
  onExitToWebsite,
  children,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: 'Order Management', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'customers', label: 'Customer Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'meal-plans', label: 'Meal Plan Catalog', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'deliveries', label: 'Deliveries & Dispatch', icon: <Truck className="w-4 h-4" /> },
    { id: 'personnel', label: 'Delivery Personnel', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'reports', label: 'Operational Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Audit (25-Pt)', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleSelectSection = (id: string) => {
    onNavigateSection(id);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E5E5] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#096E21] bg-[#FEF2A3] px-2.5 py-1 rounded">
              Operations Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExitToWebsite}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#096E21] font-medium px-3 py-1.5 rounded-lg border border-[#E5E5E5] hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#E5E5E5]">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-[#1A1A1A]">
                {adminUser.displayName}
              </div>
              <div className="text-[11px] text-[#096E21] font-semibold uppercase">
                {adminUser.role.replace('_', ' ')}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-neutral-500 hover:text-rose-600"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-1">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-3 shadow-xs space-y-1 sticky top-24">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Operations Management
            </div>
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#096E21] text-white shadow-xs'
                      : 'text-[#666666] hover:text-[#1A1A1A] hover:bg-neutral-50'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#096E21]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex">
            <div className="w-64 bg-white h-full p-4 space-y-2 shadow-2xl flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <Logo size="sm" />
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-1 rounded-lg hover:bg-neutral-100"
                  >
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>
                <div className="pt-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Operations Navigation
                </div>
                {navItems.map((item) => {
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        isActive
                          ? 'bg-[#096E21] text-white'
                          : 'text-[#666666] hover:bg-neutral-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
                <button
                  onClick={onExitToWebsite}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-[#E5E5E5] text-xs font-medium text-[#666666] cursor-pointer"
                >
                  <span>Public Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full justify-center"
                  onClick={onLogout}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Work Surface */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
