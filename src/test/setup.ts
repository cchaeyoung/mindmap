import '@testing-library/jest-dom';

(HTMLCanvasElement.prototype as any).getContext = () => ({
  measureText: (text: string) => ({ width: text.length * 8 }),
  font: '',
});
