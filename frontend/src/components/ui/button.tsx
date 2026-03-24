import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'secondary' | 'outline' | 'danger';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  default: 'bg-primary text-white hover:bg-[#0b3d68]',
  secondary: 'bg-secondary text-white hover:bg-blue-700',
  outline: 'border border-border bg-white text-foreground hover:bg-slate-50',
  danger: 'bg-danger text-white hover:bg-red-700'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
