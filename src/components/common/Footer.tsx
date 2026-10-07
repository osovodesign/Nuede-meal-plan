import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, CheckSquare, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-[#E5E5E5] text-[#1A1A1A] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-[#666666] max-w-md leading-relaxed">
              Wholesome, chef-curated meal subscriptions prepared with real, unrefined ingredients. Delivering daily balanced nutrition straight to your office or doorstep.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-[#096E21] bg-[#FEF2A3]/60 px-3 py-1.5 rounded-lg w-fit border border-[#FEF2A3]">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Centralized Order & Delivery Tracking</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#1A1A1A]">
              Platform Links
            </h4>
            <ul className="space-y-2 text-sm text-[#666666]">
              <li>
                <button
                  onClick={() => onNavigate('meal-plans')}
                  className="hover:text-[#096E21] transition-colors cursor-pointer"
                >
                  Browse Meal Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#096E21] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('confirm-delivery')}
                  className="text-[#096E21] font-semibold hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Confirm Food Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#096E21] transition-colors cursor-pointer"
                >
                  Operations Staff Login
                </button>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#1A1A1A]">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm text-[#666666]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#096E21] shrink-0 mt-0.5" />
                <span>14 Admiralty Way, Lekki Phase 1, Lagos</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#096E21] shrink-0" />
                <span>+234 812 000 NUEDE</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#096E21] shrink-0" />
                <span>orders@nuede.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <p>© {new Date().getFullYear()} Nuede Foods Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted for healthy living</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
