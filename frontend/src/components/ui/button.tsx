import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'secondary' | 'outline' | 'danger' | 'tertiary';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  default: 'bg-secondary text-white hover:bg-secondary-container',
  secondary: 'bg-primary-container text-white hover:bg-primary',
  outline: 'bg-surface-container-lowest text-on-surface ghost-border hover:bg-surface-container-low',
  danger: 'bg-error text-white hover:bg-red-700',
  tertiary: 'bg-transparent text-on-surface-variant hover:bg-surface-container-low'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium spring-hover disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
