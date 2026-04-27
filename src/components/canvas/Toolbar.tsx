import { Plus } from 'lucide-react';
import FloatingPanel from '../common/FloatingPanel';
import IconButton from '../common/IconButton';
import { useMapStore } from '@/store/mapStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useUIStore } from '@/store/uiStore';
import { NODE_DEFAULT_COLOR_INDEX } from '@/constants/node';

export default function Toolbar() {
  const addNode = useMapStore((state) => state.addNode);
  const cam = useCanvasStore((state) => state.cam);
  const stageSize = useCanvasStore((state) => state.stageSize);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setEditingNode = useUIStore((state) => state.setEditingNode);

  const handleAddRoot = () => {
    const centerX = (-cam.x + stageSize.width / 2) / cam.zoom;
    const centerY = (-cam.y + stageSize.height / 2) / cam.zoom;
    const newId = addNode({
      x: centerX,
      y: centerY,
      label: '',
      parentId: null,
      colorIndex: NODE_DEFAULT_COLOR_INDEX,
      size: 'M',
    });
    setSelectedNode(newId);
    setEditingNode(newId);
  };

  return (
    <div className="fixed bottom-5.5 left-1/2 z-20 -translate-x-1/2">
      <FloatingPanel className="flex items-center gap-0.5 rounded-[14px] p-1">
        <IconButton
          onClick={handleAddRoot}
          title="새 항목 추가"
          className="h-8 gap-1.5 rounded-[10px] px-3 text-xs font-medium"
        >
          <Plus size={15} />
        </IconButton>
      </FloatingPanel>
    </div>
  );
}
