import { Plus } from 'lucide-react';
import IconButton from '@/components/common/IconButton';

interface Props {
  x: number;
  y: number;
  onClick: () => void;
}

export default function NodeAddButton({ x, y, onClick }: Props) {
  return (
    <div
      style={{ position: 'fixed', left: x, top: y, transform: 'translate(-50%, -50%)', zIndex: 45 }}
    >
      <IconButton
        onClick={onClick}
        title="하위 항목 추가"
        className="border-border bg-card hover:border-primary/50 hover:bg-primary/20 hover:text-primary h-5.5 w-5.5 rounded-full border shadow-[0_2px_10px_var(--mm-shadow)] hover:scale-[1.15]"
      >
        <Plus size={12} />
      </IconButton>
    </div>
  );
}
