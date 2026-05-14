import { describe, expect, it } from 'vitest';
import { authSchema } from './auth';

describe('authSchema', () => {
  describe('email', () => {
    it('올바른 이메일을 통과시킨다', async () => {
      const result = await authSchema.safeParseAsync({
        email: 'test@example.com',
        password: '12345678',
      });
      expect(result.success).toBe(true);
    });

    it('이메일 형식이 아니면 실패한다', async () => {
      const result = await authSchema.safeParseAsync({ email: 'notanemail', password: '12345678' });
      expect(result.success).toBe(false);
    });

    it('이메일이 비어있으면 실패한다', async () => {
      const result = await authSchema.safeParseAsync({ email: '', password: '12345678' });
      expect(result.success).toBe(false);
    });
  });

  describe('password', () => {
    it('8자 이상이면 통과한다', async () => {
      const result = await authSchema.safeParseAsync({
        email: 'test@example.com',
        password: '12345678',
      });
      expect(result.success).toBe(true);
    });

    it('8자 미만이면 실패한다', async () => {
      const result = await authSchema.safeParseAsync({
        email: 'test@example.com',
        password: '1234567',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('confirmPassword', () => {
    it('비밀번호와 일치하면 통과한다', async () => {
      const result = await authSchema.safeParseAsync({
        email: 'test@example.com',
        password: '12345678',
        confirmPassword: '12345678',
      });
      expect(result.success).toBe(true);
    });

    it('비밀번호와 일치하지 않으면 실패한다', async () => {
      const result = await authSchema.safeParseAsync({
        email: 'test@example.com',
        password: '12345678',
        confirmPassword: 'different',
      });
      expect(result.success).toBe(false);
    });

    it('confirmPassword가 없으면 통과한다 (로그인 모드)', async () => {
      const result = await authSchema.safeParseAsync({
        email: 'test@example.com',
        password: '12345678',
      });
      expect(result.success).toBe(true);
    });
  });
});
