import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[#E5E5E5] bg-white/50 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-full bg-[#FEF2A3]/50 text-[#096E21] flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h4 className="text-base font-semibold text-[#1A1A1A]">{title}</h4>
      <p className="text-sm text-[#666666] max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
