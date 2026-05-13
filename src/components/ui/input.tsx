import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input bg-input placeholder:text-muted-foreground focus-visible:border-primary/50 aria-invalid:border-destructive w-full min-w-0 rounded-md border px-2.5 py-1 text-base transition-[border-color] outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Input };
