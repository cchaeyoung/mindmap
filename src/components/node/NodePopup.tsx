import IconButton from '@/components/common/IconButton';
import { SIDEBAR_WIDTH } from '@/constants/layout';
import { NODE_COLORS_DARK, NODE_COLORS_LIGHT, TEXT_COLORS } from '@/constants/node';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLayoutEffect, useRef, useState } from 'react';
import { useUIStore } from '@/store/uiStore';

interface Props {
  x: number;
  y: number;
  yBelow: number;
  nodeColorIndex: number;
  onEdit: () => void;
  onDelete: () => void;
  onColorChange: (colorIndex: number) => void;
  onSizeChange: (size: 'S' | 'M' | 'L') => void;
  currentSize: 'S' | 'M' | 'L';
  onShapeChange: (shape: 'pill' | 'round' | 'sharp') => void;
  currentShape: 'pill' | 'round' | 'sharp';
  onTextColorChange: (color: string | null) => void;
  currentTextColor?: string;
  onBoldChange: (v: boolean) => void;
  onItalicChange: (v: boolean) => void;
  onUnderlineChange: (v: boolean) => void;
  onStrikethroughChange: (v: boolean) => void;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  onMemoOpen: () => void;
  hasMemo: boolean;
}

export default function NodePopup({
  x,
  y,
  yBelow,
  nodeColorIndex,
  onEdit,
  onDelete,
  onColorChange,
  onSizeChange,
  currentSize,
  onShapeChange,
  currentShape,
  onTextColorChange,
  currentTextColor,
  onBoldChange,
  onItalicChange,
  onUnderlineChange,
  onStrikethroughChange,
  bold,
  italic,
  underline,
  strikethrough,
  onMemoOpen,
  hasMemo,
}: Props) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sizePaletteOpen, setSizePaletteOpen] = useState(false);
  const [shapePaletteOpen, setShapePaletteOpen] = useState(false);
  const [textColorPaletteOpen, setTextColorPaletteOpen] = useState(false);
  const [textStylePaletteOpen, setTextStylePaletteOpen] = useState(false);

  const closeAllPalettes = () => {
    setPaletteOpen(false);
    setSizePaletteOpen(false);
    setShapePaletteOpen(false);
    setTextColorPaletteOpen(false);
    setTextStylePaletteOpen(false);
  };
  const popupRef = useRef<HTMLDivElement>(null);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const memoPanelNodeId = useUIStore((state) => state.memoPanelNodeId);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const palette = isDark ? NODE_COLORS_DARK : NODE_COLORS_LIGHT;
  const ringBoxShadow = isDark
    ? '0 0 0 1.5px rgba(255,255,255,0.75), 0 0 0 3px rgba(0,0,0,0.3)'
    : '0 0 0 1.5px rgba(0,0,0,0.7), 0 0 0 3px rgba(255,255,255,0.4)';

  useLayoutEffect(() => {
    if (!popupRef.current) return;
    const w = popupRef.current.offsetWidth;
    const vw = window.innerWidth;
    const leftBound = sidebarOpen ? SIDEBAR_WIDTH + 8 : 8;
    const newX = Math.min(Math.max(x, leftBound + w / 2), vw - w / 2 - 8);
    popupRef.current.style.left = `${newX}px`;
    const h = popupRef.current.offsetHeight;
    if (y - h < 8) {
      popupRef.current.style.top = `${yBelow}px`;
      popupRef.current.style.transform = 'translateX(-50%)';
    } else {
      popupRef.current.style.top = `${y}px`;
      popupRef.current.style.transform = 'translateX(-50%) translateY(-100%)';
    }
  }, [x, y, yBelow, sidebarOpen]);

  return (
    <div
      ref={popupRef}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: 'translateX(-50%) translateY(-100%)',
        zIndex: 50,
      }}
      className="border-border bg-popover flex w-max flex-col overflow-hidden rounded-xl border shadow-[0_8px_32px_var(--mm-shadow)] backdrop-blur-[28px]"
    >
      {paletteOpen && (
        <div className="border-border flex flex-wrap items-center gap-1.25 border-b px-2.5 py-2">
          {palette.map((color, i) => (
            <button
              key={i}
              style={{
                background: color ?? 'var(--background)',
                boxShadow: i === nodeColorIndex ? ringBoxShadow : undefined,
              }}
              onClick={() => {
                onColorChange(i);
                setPaletteOpen(false);
              }}
              className="border-border h-4 w-4 shrink-0 cursor-pointer rounded-full border-[1.5px] transition-transform hover:scale-125"
            />
          ))}
        </div>
      )}

      {sizePaletteOpen && (
        <div className="border-border flex items-center gap-1 border-b px-2.5 py-2">
          {(['S', 'M', 'L'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => {
                onSizeChange(sz);
                setSizePaletteOpen(false);
              }}
              className={`h-6.5 cursor-pointer rounded-[7px] px-2.25 text-[11px] font-medium transition-all ${
                currentSize === sz
                  ? 'bg-primary/18 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      )}

      {shapePaletteOpen && (
        <div className="border-border flex items-center gap-1.25 border-b px-2.5 py-2">
          {(
            [
              { value: 'pill', svg: <rect x="1" y="3" width="10" height="6" rx="3" /> },
              { value: 'round', svg: <rect x="1" y="1" width="10" height="10" rx="3.5" /> },
              { value: 'sharp', svg: <rect x="1" y="1" width="10" height="10" rx="1" /> },
            ] as const
          ).map(({ value, svg }) => (
            <button
              key={value}
              onClick={() => {
                onShapeChange(value);
                setShapePaletteOpen(false);
              }}
              className={`flex h-6.5 w-6.5 cursor-pointer items-center justify-center rounded-[7px] transition-all ${
                currentShape === value
                  ? 'bg-primary/18 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {svg}
              </svg>
            </button>
          ))}
        </div>
      )}

      {textColorPaletteOpen && (
        <div className="border-border flex flex-wrap items-center gap-1.25 border-b px-2.5 py-2">
          {TEXT_COLORS.map((color, i) => (
            <button
              key={i}
              style={{
                background: color ?? (isDark ? 'rgba(255,255,255,0.9)' : 'rgba(14,12,42,0.92)'),
                boxShadow:
                  (color ?? null) === (currentTextColor ?? null) ? ringBoxShadow : undefined,
              }}
              onClick={() => {
                onTextColorChange(color);
                setTextColorPaletteOpen(false);
              }}
              className="border-border h-4 w-4 shrink-0 cursor-pointer rounded-full border-[1.5px] transition-transform hover:scale-125"
            />
          ))}
        </div>
      )}

      {textStylePaletteOpen && (
        <div className="border-border flex items-center gap-1 border-b px-2.5 py-2">
          {[
            {
              label: 'B',
              active: !!bold,
              toggle: () => onBoldChange(!bold),
              style: { fontWeight: 800 },
            },
            {
              label: 'I',
              active: !!italic,
              toggle: () => onItalicChange(!italic),
              style: { fontStyle: 'italic' as const },
            },
            {
              label: 'U',
              active: !!underline,
              toggle: () => onUnderlineChange(!underline),
              style: { textDecoration: 'underline' as const },
            },
            {
              label: 'S',
              active: !!strikethrough,
              toggle: () => onStrikethroughChange(!strikethrough),
              style: { textDecoration: 'line-through' as const },
            },
          ].map(({ label, active, toggle, style }) => (
            <button
              key={label}
              onClick={toggle}
              style={style}
              className={`h-6.5 w-6.5 cursor-pointer rounded-[7px] text-[12px] transition-all ${
                active
                  ? 'bg-primary/18 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-0.5 px-2 py-1.25">
        <button
          title="색상 변경"
          style={{ background: palette[nodeColorIndex] ?? 'var(--background)' }}
          onClick={() => {
            const isOpen = paletteOpen;
            closeAllPalettes();
            if (!isOpen) setPaletteOpen(true);
          }}
          className="h-4.5 w-4.5 shrink-0 cursor-pointer rounded-full border-[2.5px] border-white/20 transition-all hover:scale-110 hover:border-white/55"
        />

        <div className="bg-border mx-1 h-4 w-px shrink-0" />

        <button
          title="크기 변경"
          onClick={() => {
            const isOpen = sizePaletteOpen;
            closeAllPalettes();
            if (!isOpen) setSizePaletteOpen(true);
          }}
          className={`h-6.5 cursor-pointer rounded-[7px] px-2 text-[11px] font-medium transition-all ${
            sizePaletteOpen
              ? 'bg-primary/18 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          {currentSize}
        </button>

        <button
          title="모양 변경"
          onClick={() => {
            const isOpen = shapePaletteOpen;
            closeAllPalettes();
            if (!isOpen) setShapePaletteOpen(true);
          }}
          className={`flex h-6.5 w-6.5 cursor-pointer items-center justify-center rounded-[7px] transition-all ${
            shapePaletteOpen
              ? 'bg-primary/18 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {currentShape === 'pill' && <rect x="1" y="3" width="10" height="6" rx="3" />}
            {currentShape === 'round' && <rect x="1" y="1" width="10" height="10" rx="3.5" />}
            {currentShape === 'sharp' && <rect x="1" y="1" width="10" height="10" rx="1" />}
          </svg>
        </button>

        <div className="bg-border mx-1 h-4 w-px shrink-0" />

        <button
          title="텍스트 색상"
          onClick={() => {
            const isOpen = textColorPaletteOpen;
            closeAllPalettes();
            if (!isOpen) setTextColorPaletteOpen(true);
          }}
          className={`flex h-6.5 w-6.5 cursor-pointer flex-col items-center justify-center gap-[1.5px] rounded-[7px] text-[11px] font-bold transition-all ${textColorPaletteOpen ? 'bg-primary/18 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
        >
          <span>A</span>
          <span
            className="block h-0.5 w-2.5 rounded-full"
            style={{ background: currentTextColor ?? 'currentColor' }}
          />
        </button>

        <button
          title="텍스트 스타일"
          onClick={() => {
            const isOpen = textStylePaletteOpen;
            closeAllPalettes();
            if (!isOpen) setTextStylePaletteOpen(true);
          }}
          className={`h-6.5 w-6.5 cursor-pointer rounded-[7px] text-[11px] font-bold transition-all ${textStylePaletteOpen ? 'bg-primary/18 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
        >
          T
        </button>

        <div className="bg-border mx-1 h-4 w-px shrink-0" />

        <IconButton title="편집" onClick={onEdit} className="h-6.5 w-6.5 rounded-[7px]">
          <Pencil size={12} />
        </IconButton>
        <div className="relative">
          <IconButton title="메모" onClick={onMemoOpen} isActive={!!memoPanelNodeId} className={`h-6.5 w-6.5 rounded-[7px] ${memoPanelNodeId ? 'bg-primary/18 text-primary' : ''}`}>
            <FileText size={12} />
          </IconButton>
          {hasMemo && (
            <span className="bg-primary absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full" />
          )}
        </div>
        <IconButton
          title="삭제"
          onClick={onDelete}
          className="h-6.5 w-6.5 rounded-[7px] hover:bg-[rgba(248,113,113,0.1)] hover:text-[#f87171]"
        >
          <Trash2 size={12} />
        </IconButton>
      </div>
    </div>
  );
}
