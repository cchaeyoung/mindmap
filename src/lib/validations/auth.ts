import { z } from 'zod';

export const authSchema = z
  .object({
    email: z.email('올바른 이메일 형식이 아닙니다'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== undefined && data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: 'custom',
        message: '비밀번호가 일치하지 않습니다',
        path: ['confirmPassword'],
      });
    }
  });

export type AuthValues = z.infer<typeof authSchema>;
