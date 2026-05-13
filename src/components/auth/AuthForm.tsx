'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import OAuthButtons from './OAuthButtons';

interface Props {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export default function AuthForm({ mode, onModeChange }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isLogin = mode === 'login';
  const isValid = !!email && !!password && (isLogin || password === confirmPassword);

  const switchMode = () => {
    onModeChange(isLogin ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <OAuthButtons />

      <div className="flex items-center gap-3">
        <div className="border-border flex-1 border-t" />
        <span className="text-muted-foreground text-[11.5px]">또는 이메일로</span>
        <div className="border-border flex-1 border-t" />
      </div>

      <div className="flex flex-col gap-2.5">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          type="email"
          maxLength={80}
          className="rounded-[10px] px-[13px] py-[10px] text-[13.5px]"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          type="password"
          maxLength={100}
          className="rounded-[10px] px-[13px] py-[10px] text-[13.5px]"
        />
        {!isLogin && (
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 확인"
            type="password"
            maxLength={100}
            className={`rounded-[10px] px-[13px] py-[10px] text-[13.5px] ${confirmPassword && password !== confirmPassword ? 'border-destructive' : ''}`}
          />
        )}
      </div>

      <Button
        disabled={!isValid}
        className="bg-primary/90 hover:bg-primary h-auto w-full rounded-[11px] py-[11px] text-[13.5px] font-semibold"
      >
        {isLogin ? '로그인' : '회원가입'}
      </Button>

      <p className="text-muted-foreground text-center text-[12px]">
        {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
        <button
          onClick={switchMode}
          className="text-primary cursor-pointer font-medium hover:underline"
        >
          {isLogin ? '회원가입' : '로그인'}
        </button>
      </p>
    </div>
  );
}
