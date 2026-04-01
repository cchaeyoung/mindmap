import { Plus } from 'lucide-react';
import FloatingPanel from '../common/FloatingPanel';
import IconButton from '../common/IconButton';
import { useMapStore } from '@/store/mapStore';
import { NODE_DEFAULT_COLOR } from '@/constants/node';

export default function Toolbar() {
  const addNode = useMapStore((state) => state.addNode);

  const handleAddRoot = () => {
    addNode({
      x: 400,
      y: 300,
      label: '새 항목',
      parentId: null,
      color: NODE_DEFAULT_COLOR,
    });
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
