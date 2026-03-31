import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[96px] w-full rounded-[8px] bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface outline-none ghost-border placeholder:text-on-surface-variant/50 focus-visible:ring-2 focus-visible:ring-secondary-fixed-dim',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
