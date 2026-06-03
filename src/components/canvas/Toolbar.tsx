import { Hand, MousePointer2, Plus, Redo2, Undo2, Wand2 } from 'lucide-react';
import FloatingPanel from '../common/FloatingPanel';
import IconButton from '../common/IconButton';
import { useMapStore } from '@/store/mapStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import AiGeneratePopover from './AiGeneratePopover';
import { useEffect, useRef, useState } from 'react';
import { useAiGenerate } from '@/hooks/useAiGenerate';
import { SIDEBAR_OFFSET } from '@/constants/layout';

export default function Toolbar() {
  const [aiPopoverOpen, setAiPopoverOpen] = useState(false);
  const { isGenerating, handleGenerate, handleCancel } = useAiGenerate();
  const wand2Ref = useRef<HTMLDivElement>(null);
  const aiModalRef = useRef<HTMLDivElement>(null);
  const [anchorX, setAnchorX] = useState(0);

  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setEditingNode = useUIStore((state) => state.setEditingNode);
  const canvasMode = useUIStore((state) => state.canvasMode);
  const setCanvasMode = useUIStore((state) => state.setCanvasMode);
  const isPlacing = useUIStore((state) => state.isPlacing);
  const setIsPlacing = useUIStore((state) => state.setIsPlacing);
  const undo = useMapStore((state) => state.undo);
  const redo = useMapStore((state) => state.redo);
  const historyIndex = useMapStore((state) => state.historyIndex);
  const historyLength = useMapStore((state) => state.history.length);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const isMac =
    typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');

  useEffect(() => {
    const measure = () => {
      if (!wand2Ref.current) return;
      const rect = wand2Ref.current.getBoundingClientRect();
      setAnchorX(rect.left + rect.width / 2 - (sidebarOpen ? SIDEBAR_OFFSET : 0));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!aiPopoverOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        !aiModalRef.current?.contains(e.target as Node) &&
        !wand2Ref.current?.contains(e.target as Node)
      ) {
        setAiPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [aiPopoverOpen]);

  return (
    <>
      {isGenerating && (
        <div
          style={{ left: anchorX, marginLeft: sidebarOpen ? SIDEBAR_OFFSET : 0 }}
          className="fixed bottom-20 z-30 -translate-x-1/2 animate-[mm-fade-in_0.2s_ease] transition-[margin] duration-280"
        >
          <FloatingPanel className="relative flex items-center gap-3 rounded-[14px] px-3.5 py-2">
            <span className="border-primary/25 border-t-primary h-3 w-3 shrink-0 animate-spin rounded-full border-[1.5px]" />
            <span className="text-foreground text-[12.5px] font-medium">
              마인드맵을 생성하고 있어요
            </span>
            <button
              onClick={handleCancel}
              className="border-border text-muted-foreground hover:border-primary/40 hover:text-primary ml-0.5 shrink-0 rounded-[7px] border px-2 py-0.5 text-[11.5px] font-medium transition-colors"
            >
              취소
            </button>
            <div className="border-border bg-card absolute -bottom-1.25 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r border-b" />
          </FloatingPanel>
        </div>
      )}

      <div
        style={{ marginLeft: sidebarOpen ? SIDEBAR_OFFSET : 0 }}
        className="fixed bottom-5.5 left-1/2 z-20 -translate-x-1/2 transition-[margin] duration-[280ms]"
      >
        <FloatingPanel className="flex items-center gap-0.5 rounded-[14px] p-1">
          <IconButton
            onClick={() => {
              setIsPlacing(true);
              setSelectedNode(null);
            }}
            title="새 항목 추가 (N)"
            isActive={isPlacing}
            className={cn(
              'h-8 rounded-[10px] px-3',
              isPlacing && 'bg-primary/20 text-(--mm-acc-fg)'
            )}
          >
            <Plus size={15} />
          </IconButton>
          <div className="bg-border mx-0.5 h-4 w-px shrink-0" />
          <div ref={wand2Ref}>
            <IconButton
              onClick={() => {
                if (isGenerating) return;
                setIsPlacing(false);
                setAiPopoverOpen((prev) => !prev);
              }}
              title="AI 마인드맵 생성"
              isActive={aiPopoverOpen}
              className={cn(
                'h-8 rounded-[10px] px-3',
                aiPopoverOpen && 'bg-primary/20 text-(--mm-acc-fg)',
                isGenerating && 'cursor-not-allowed opacity-40'
              )}
            >
              <Wand2 size={15} />
            </IconButton>
          </div>

          <div className="bg-border mx-0.5 h-4 w-px shrink-0" />

          <IconButton
            onClick={() => {
              setCanvasMode('select');
              setIsPlacing(false);
            }}
            title="선택 (V)"
            isActive={canvasMode === 'select'}
            className={cn(
              'h-8 rounded-[10px] px-3',
              canvasMode === 'select' && 'bg-primary/20 text-(--mm-acc-fg)'
            )}
          >
            <MousePointer2 size={15} />
          </IconButton>
          <IconButton
            onClick={() => {
              setCanvasMode('hand');
              setIsPlacing(false);
              setSelectedNode(null);
              setEditingNode(null);
            }}
            title="이동 (H)"
            isActive={canvasMode === 'hand'}
            className={cn(
              'h-8 rounded-[10px] px-3',
              canvasMode === 'hand' && 'bg-primary/20 text-(--mm-acc-fg)'
            )}
          >
            <Hand size={15} />
          </IconButton>

          <div className="bg-border mx-0.5 h-4 w-px shrink-0" />

          <IconButton
            onClick={undo}
            title={`실행 취소 (${isMac ? '⌘Z' : 'Ctrl+Z'})`}
            disabled={historyIndex <= 0}
            className="h-8 rounded-[10px] px-3"
          >
            <Undo2 size={15} />
          </IconButton>
          <IconButton
            onClick={redo}
            title={`다시 실행 (${isMac ? '⌘⇧Z' : 'Ctrl+Shift+Z'})`}
            disabled={historyIndex >= historyLength - 1}
            className="h-8 rounded-[10px] px-3"
          >
            <Redo2 size={15} />
          </IconButton>
        </FloatingPanel>
      </div>

      <div ref={aiModalRef}>
        <AiGeneratePopover
          open={aiPopoverOpen}
          onClose={() => setAiPopoverOpen(false)}
          onSubmit={(topic) => {
            setAiPopoverOpen(false);
            handleGenerate(topic);
          }}
          anchorX={anchorX}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </>
  );
}
