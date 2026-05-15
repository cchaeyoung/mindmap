import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  const mockNow = new Date('2024-01-01T12:00:00Z').getTime();

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('0초 차이면 방금 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow).toISOString())).toBe('방금 전');
  });

  it('59초 차이면 방금 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow - 59 * 1000).toISOString())).toBe('방금 전');
  });

  it('1분 차이면 1분 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow - 60 * 1000).toISOString())).toBe('1분 전');
  });

  it('15분 차이면 15분 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow - 15 * 60 * 1000).toISOString())).toBe('15분 전');
  });

  it('59분 차이면 59분 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow - 59 * 60 * 1000).toISOString())).toBe('59분 전');
  });

  it('1시간 차이면 1시간 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow - 60 * 60 * 1000).toISOString())).toBe('1시간 전');
  });

  it('3시간 차이면 3시간 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow - 3 * 60 * 60 * 1000).toISOString())).toBe('3시간 전');
  });

  it('23시간 차이면 23시간 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow - 23 * 60 * 60 * 1000).toISOString())).toBe('23시간 전');
  });

  it('1일 차이면 1일 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow - 24 * 60 * 60 * 1000).toISOString())).toBe('1일 전');
  });

  it('2일 차이면 2일 전을 반환한다', () => {
    expect(formatDate(new Date(mockNow - 2 * 24 * 60 * 60 * 1000).toISOString())).toBe('2일 전');
  });
});
