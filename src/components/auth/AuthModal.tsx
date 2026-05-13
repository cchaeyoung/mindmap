'use client';

import { useAuthStore } from '@/store/authStore';
import IconButton from '@/components/common/IconButton';
import { X } from 'lucide-react';
import { useState } from 'react';
import AuthForm from './AuthForm';

export default function AuthModal() {
  const authModalOpen = useAuthStore((state) => state.authModalOpen);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const close = () => {
    setAuthModalOpen(false);
    setMode('login');
  };

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: authModalOpen ? 1 : 0,
        pointerEvents: authModalOpen ? 'all' : 'none',
        transition: 'opacity 0.2s',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380,
          transform: authModalOpen ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.97)',
          transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
        }}
        className="bg-popover border-border flex flex-col gap-[18px] rounded-[22px] border p-[32px_28px_28px] shadow-[0_32px_80px_var(--mm-shadow)]"
      >
        {/* 헤더 */}
        <div className="relative text-center">
          <IconButton
            onClick={close}
            title="닫기"
            className="absolute top-0 right-0 h-7 w-7 rounded-[8px]"
          >
            <X size={15} />
          </IconButton>
          <div className="text-foreground text-[20px] font-bold tracking-[-0.4px]">
            {mode === 'login' ? '로그인' : '회원가입'}
          </div>
        </div>

        <AuthForm mode={mode} onModeChange={setMode} />
      </div>
    </div>
  );
}
