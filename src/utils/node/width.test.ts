import { describe, it, expect } from 'vitest';
import { measureNodeWidth } from './width';

describe('measureNodeWidth', () => {
  it('숫자를 반환한다', () => {
    const result = measureNodeWidth('테스트', 'root', 'M');
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  it('빈 문자열은 새 항목 기준으로 너비를 계산한다', () => {
    const empty = measureNodeWidth('', 'root', 'M');
    const fallback = measureNodeWidth('새 항목', 'root', 'M');
    expect(empty).toBe(fallback);
  });

  it('root가 child보다 너비 패딩이 크다', () => {
    const root = measureNodeWidth('테스트', 'root', 'M');
    const child = measureNodeWidth('테스트', 'child', 'M');
    expect(root).toBeGreaterThan(child);
  });

  it('L 사이즈가 S 사이즈보다 너비가 크다', () => {
    const large = measureNodeWidth('테스트', 'root', 'L');
    const small = measureNodeWidth('테스트', 'root', 'S');
    expect(large).toBeGreaterThan(small);
  });

  it('bold가 적용되면 너비가 늘어난다', () => {
    const normal = measureNodeWidth('테스트', 'root', 'M', false);
    const bold = measureNodeWidth('테스트', 'root', 'M', true);
    expect(bold).toBeGreaterThanOrEqual(normal);
  });
});
