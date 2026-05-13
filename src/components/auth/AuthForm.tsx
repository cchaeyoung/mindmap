'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authSchema, type AuthValues } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import OAuthButtons from './OAuthButtons';

interface Props {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export default function AuthForm({ mode, onModeChange }: Props) {
  const isLogin = mode === 'login';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, dirtyFields },
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    mode: 'onTouched',
  });

  const confirmPasswordFilled = !!useWatch({ control, name: 'confirmPassword' });

  const switchMode = () => {
    onModeChange(isLogin ? 'signup' : 'login');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(() => {})} className="flex flex-col gap-[16px]">
      <OAuthButtons />

      <div className="flex items-center gap-3">
        <div className="border-border flex-1 border-t" />
        <span className="text-muted-foreground text-[11.5px]">또는 이메일로</span>
        <div className="border-border flex-1 border-t" />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          <Input
            {...register('email')}
            placeholder="이메일 주소"
            type="email"
            maxLength={80}
            aria-invalid={!!errors.email && !!dirtyFields.email}
            className="rounded-[10px] px-[13px] py-[10px] text-[13.5px]"
          />
          {errors.email && dirtyFields.email && (
            <p className="text-destructive px-1 text-[11.5px]">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative">
            <Input
              {...register('password')}
              placeholder="비밀번호"
              type={showPassword ? 'text' : 'password'}
              maxLength={100}
              aria-invalid={!!errors.password && !!dirtyFields.password}
              className="rounded-[10px] px-[13px] py-[10px] pr-[38px] text-[13.5px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-[11px] -translate-y-1/2 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && dirtyFields.password && (
            <p className="text-destructive px-1 text-[11.5px]">{errors.password.message}</p>
          )}
        </div>

        {!isLogin && (
          <div className="flex flex-col gap-1">
            <div className="relative">
              <Input
                {...register('confirmPassword')}
                placeholder="비밀번호 확인"
                type={showConfirmPassword ? 'text' : 'password'}
                maxLength={100}
                aria-invalid={!!errors.confirmPassword && !!dirtyFields.confirmPassword}
                className="rounded-[10px] px-[13px] py-[10px] pr-[38px] text-[13.5px]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-[11px] -translate-y-1/2 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && dirtyFields.confirmPassword && (
              <p className="text-destructive px-1 text-[11.5px]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || (!isLogin && !confirmPasswordFilled)}
        className="bg-primary/90 hover:bg-primary h-auto w-full rounded-[11px] py-[11px] text-[13.5px] font-semibold"
      >
        {isLogin ? '로그인' : '회원가입'}
      </Button>

      <p className="text-muted-foreground text-center text-[12px]">
        {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
        <button
          type="button"
          onClick={switchMode}
          className="text-primary cursor-pointer font-medium hover:underline"
        >
          {isLogin ? '회원가입' : '로그인'}
        </button>
      </p>
    </form>
  );
}
