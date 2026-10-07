import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight' | 'outlined' | 'muted';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-[#E5E5E5] shadow-xs',
    highlight: 'bg-[#FEF2A3]/25 border border-[#FEF2A3] shadow-xs',
    outlined: 'bg-transparent border border-[#E5E5E5]',
    muted: 'bg-[#F7F7F7] border border-[#E5E5E5]',
  };

  return (
    <div
      className={`rounded-xl p-5 md:p-6 transition-all ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
