'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-[15px] text-indigo-400" />,
        info: <InfoIcon className="size-[15px] text-indigo-400" />,
        warning: <TriangleAlertIcon className="size-[15px] text-amber-400" />,
        error: <OctagonXIcon className="size-[15px] text-rose-400" />,
        loading: <Loader2Icon className="size-[15px] animate-spin text-indigo-400" />,
      }}
      toastOptions={{
        style: {
          fontSize: '12.5px',
          padding: '10px 12px',
          maxWidth: '320px',
          gap: '8px',
          boxShadow: '0 4px 20px var(--mm-shadow)',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
