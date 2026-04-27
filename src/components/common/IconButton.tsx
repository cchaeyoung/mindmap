import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  disabled?: boolean;
  isActive?: boolean;
}

export default function IconButton({ onClick, children, className, title, disabled, isActive }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-all disabled:cursor-default disabled:opacity-30',
        isActive ? '' : 'hover:bg-accent hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  );
}
