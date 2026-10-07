import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from '@/src/components/ui/Button';
import { Menu, X, CheckSquare, Shield, UtensilsCrossed, Phone } from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Meal Plans', route: 'meal-plans' },
    { label: 'How It Works', route: 'how-it-works' },
    {
      label: 'Confirm Delivery',
      route: 'confirm-delivery',
      highlight: true,
      icon: <CheckSquare className="w-4 h-4 text-[#096E21]" />,
    },
    {
      label: 'Admin Portal',
      route: 'admin',
      icon: <Shield className="w-3.5 h-3.5 text-neutral-400" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#096E21] rounded-lg p-1"
          aria-label="Nuede Home"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer py-1 border-b-2 ${
                  isActive
                    ? 'border-[#096E21] text-[#096E21]'
                    : link.highlight
                    ? 'border-transparent text-[#096E21] hover:text-[#07581a] font-semibold'
                    : 'border-transparent text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action button */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleNav('meal-plans')}
            leftIcon={<UtensilsCrossed className="w-4 h-4" />}
          >
            Order Meal Plan
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#096E21]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E5E5] bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  currentRoute === link.route
                    ? 'bg-[#096E21]/10 text-[#096E21] font-semibold'
                    : 'text-[#1A1A1A] hover:bg-neutral-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.icon}
                  {link.label}
                </span>
                {link.highlight && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#096E21] bg-[#FEF2A3] px-2 py-0.5 rounded">
                    Quick Confirm
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-[#E5E5E5]">
            <Button
              className="w-full justify-center"
              size="md"
              variant="primary"
              onClick={() => handleNav('meal-plans')}
            >
              Order Meal Plan
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
