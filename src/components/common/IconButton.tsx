import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  disabled?: boolean;
}

export default function IconButton({ onClick, children, className, title, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground disabled:cursor-default disabled:opacity-30',
        className
      )}
    >
      {children}
    </button>
  );
}
