import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  disabled?: boolean;
  isActive?: boolean;
}

export default function IconButton({
  onClick,
  children,
  className,
  title,
  disabled,
  isActive,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'text-muted-foreground flex cursor-pointer items-center justify-center rounded-lg transition-all disabled:cursor-default disabled:opacity-30',
        isActive || disabled ? '' : 'hover:bg-accent hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  );
}
