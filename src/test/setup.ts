import '@testing-library/jest-dom';

(HTMLCanvasElement.prototype as any).getContext = (contextId: string) => {
  if (contextId !== '2d') return null;
  return {
    measureText: (text: string) => ({ width: text.length * 8 }),
    font: '',
  };
};
