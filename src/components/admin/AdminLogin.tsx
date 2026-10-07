import React, { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { Logo } from '@/src/components/common/Logo';
import { NuedeStore } from '@/src/services/store';
import { useToast } from '@/src/components/ui/Toast';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { AdminUser } from '@/src/types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@nuede.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide your staff email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication check
    setTimeout(() => {
      setIsLoading(false);
      // Valid credentials check
      if (password.length < 5) {
        setError('Invalid staff credentials. Password must be at least 5 characters.');
        showToast('Authentication failed', 'error');
        return;
      }

      const user = NuedeStore.loginAdmin(email.trim());
      showToast(`Welcome back, ${user.displayName}!`, 'success');
      onLoginSuccess(user);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#096E21] font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </button>

        {/* Brand identity header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">
            Staff Operations Portal
          </h2>
          <p className="text-xs text-[#666666] font-body">
            Secure administrative access for orders, customers, and delivery dispatch.
          </p>
        </div>

        {/* Login form card */}
        <Card className="space-y-5 p-6 sm:p-8 bg-white border border-[#E5E5E5] shadow-sm">
          <div className="flex items-center gap-2 p-3 bg-[#FEF2A3]/30 border border-[#FEF2A3] rounded-xl text-xs text-[#096E21] font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Authorized Operations Personnel Only</span>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Staff Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nuede.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center mt-2 shadow-xs"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Operations
            </Button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="pt-4 border-t border-[#E5E5E5] text-[11px] text-[#666666] space-y-1 bg-neutral-50 p-3 rounded-lg">
            <span className="font-semibold text-[#1A1A1A] block">
              Default Staff Credentials:
            </span>
            <div>Email: <code className="font-bold text-[#096E21]">admin@nuede.com</code></div>
            <div>Password: <code className="font-bold text-[#096E21]">admin123</code></div>
          </div>
        </Card>
      </div>
    </div>
  );
};
