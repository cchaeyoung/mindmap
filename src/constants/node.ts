export const NODE_STYLE = {
  root: {
    fontSize: 15,
    fontWeight: 700,
    paddingX: 20,
    paddingY: 11,
    cornerRadius: 'pill' as const,
  },
  child: { fontSize: 13, fontWeight: 600, paddingX: 14, paddingY: 8, cornerRadius: 9 },
  sub: { fontSize: 12, fontWeight: 500, paddingX: 12, paddingY: 6, cornerRadius: 7 },
};

export const NODE_DEFAULT_COLOR = '#4d69f0';
export const NODE_MIN_TEXT_WIDTH = 80;
export const NODE_SIZE_SCALE = { S: 0.8, M: 1.0, L: 1.25 } as const;

export const NODE_COLORS = [
  null,
  '#64748b',
  '#ef4444',
  '#ec4899',
  '#f97316',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#4d69f0',
  '#8b5cf6',
];
