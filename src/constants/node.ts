export const NODE_STYLE = {
  root: {
    fontSize: 15,
    fontWeight: 700,
    paddingX: 22,
    paddingY: 12,
    cornerRadius: 'pill' as const,
  },
  child: { fontSize: 13, fontWeight: 600, paddingX: 16, paddingY: 10, cornerRadius: 8 },
};

export const NODE_DEFAULT_COLOR_INDEX = 8;
export const NODE_MIN_TEXT_WIDTH = 80;
export const NODE_SIZE_SCALE = { S: 0.8, M: 1.0, L: 1.25 } as const;

export const NODE_COLORS_DARK = [
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

export const NODE_COLORS_LIGHT = [
  null,
  '#94a3b8',
  '#f87171',
  '#f472b6',
  '#fb923c',
  '#fbbf24',
  '#34d399',
  '#22d3ee',
  '#6b7fe8',
  '#a78bfa',
];
