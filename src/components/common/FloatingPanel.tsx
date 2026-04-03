import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function FloatingPanel({ className, children }: Props) {
  return (
    <div
      className={cn(
        'bg-card border-border border shadow-[0_4px_20px_var(--mm-shadow)] backdrop-blur-xl',
        className
      )}
    >
      {children}
    </div>
  );
}
