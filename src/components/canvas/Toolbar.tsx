import { Hand, MousePointer2, Plus, Redo2, Undo2 } from 'lucide-react';
import FloatingPanel from '../common/FloatingPanel';
import IconButton from '../common/IconButton';
import { useMapStore } from '@/store/mapStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useUIStore } from '@/store/uiStore';
import { NODE_DEFAULT_COLOR_INDEX, NODE_DEFAULT_SHAPE } from '@/constants/node';
import { cn } from '@/lib/utils';

export default function Toolbar() {
  const addNode = useMapStore((state) => state.addNode);
  const cam = useCanvasStore((state) => state.cam);
  const stageSize = useCanvasStore((state) => state.stageSize);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setEditingNode = useUIStore((state) => state.setEditingNode);
  const canvasMode = useUIStore((state) => state.canvasMode);
  const setCanvasMode = useUIStore((state) => state.setCanvasMode);
  const undo = useMapStore((state) => state.undo);
  const redo = useMapStore((state) => state.redo);
  const historyIndex = useMapStore((state) => state.historyIndex);
  const historyLength = useMapStore((state) => state.history.length);
  const isMac =
    typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');

  const handleAddRoot = () => {
    if (canvasMode === 'hand') setCanvasMode('select');
    const centerX = (-cam.x + stageSize.width / 2) / cam.zoom;
    const centerY = (-cam.y + stageSize.height / 2) / cam.zoom;
    const newId = addNode({
      x: centerX,
      y: centerY,
      label: '',
      parentId: null,
      colorIndex: NODE_DEFAULT_COLOR_INDEX,
      size: 'M',
      shape: NODE_DEFAULT_SHAPE,
    });
    setSelectedNode(newId);
    setEditingNode(newId);
  };

  return (
    <div className="fixed bottom-5.5 left-1/2 z-20 -translate-x-1/2">
      <FloatingPanel className="flex items-center gap-0.5 rounded-[14px] p-1">
        <IconButton
          onClick={handleAddRoot}
          title="새 항목 추가 (N)"
          className="h-8 rounded-[10px] px-3"
        >
          <Plus size={15} />
        </IconButton>

        <div className="bg-border mx-0.5 h-4 w-px shrink-0" />

        <IconButton
          onClick={() => setCanvasMode('select')}
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
  );
}
