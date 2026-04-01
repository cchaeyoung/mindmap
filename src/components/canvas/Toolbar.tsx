import { Plus } from 'lucide-react';
import FloatingPanel from '../common/FloatingPanel';
import IconButton from '../common/IconButton';

export default function Toolbar() {
  const handleAddRoot = () => {
    // TODO: 루트 노드 추가
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
