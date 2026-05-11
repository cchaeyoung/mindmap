import { describe, it, expect, beforeEach } from 'vitest';
import { useMapStore } from './mapStore';
import { useUIStore } from './uiStore';

const makeNode = () => ({
  x: 0,
  y: 0,
  label: '테스트',
  parentId: null,
  colorIndex: 8,
  size: 'M' as const,
  shape: 'pill' as const,
});

beforeEach(() => {
  useMapStore.setState({
    nodes: [],
    edges: [],
    history: [[]],
    historyIndex: 0,
    justAddedNodeId: null,
  });
  useUIStore.setState({
    selectedNodeId: null,
    editingNodeId: null,
  });
});

describe('addNode', () => {
  it('노드를 추가하면 nodes에 포함된다', () => {
    useMapStore.getState().addNode(makeNode());
    expect(useMapStore.getState().nodes).toHaveLength(1);
  });

  it('추가된 노드는 id와 width를 갖는다', () => {
    const id = useMapStore.getState().addNode(makeNode());
    const node = useMapStore.getState().nodes.find((n) => n.id === id);
    expect(node).toBeDefined();
    expect(node?.width).toBeGreaterThan(0);
  });

  it('노드 추가 후 히스토리가 저장된다', () => {
    useMapStore.getState().addNode(makeNode());
    expect(useMapStore.getState().historyIndex).toBe(1);
  });
});

describe('deleteNode', () => {
  it('노드를 삭제하면 nodes에서 제거된다', () => {
    const id = useMapStore.getState().addNode(makeNode());
    useMapStore.getState().deleteNode(id);
    expect(useMapStore.getState().nodes).toHaveLength(0);
  });

  it('부모 노드 삭제 시 자식 노드도 함께 삭제된다', () => {
    const parentId = useMapStore.getState().addNode(makeNode());
    useMapStore.getState().addNode({ ...makeNode(), parentId });
    useMapStore.getState().deleteNode(parentId);
    expect(useMapStore.getState().nodes).toHaveLength(0);
  });
});

describe('updateNode', () => {
  it('노드 속성을 업데이트한다', () => {
    const id = useMapStore.getState().addNode(makeNode());
    useMapStore.getState().updateNode(id, { label: '수정됨' });
    const node = useMapStore.getState().nodes.find((n) => n.id === id);
    expect(node?.label).toBe('수정됨');
  });

  it('skipHistory 옵션이 있으면 히스토리를 저장하지 않는다', () => {
    const id = useMapStore.getState().addNode(makeNode());
    const indexBefore = useMapStore.getState().historyIndex;
    useMapStore.getState().updateNode(id, { label: '수정됨' }, { skipHistory: true });
    expect(useMapStore.getState().historyIndex).toBe(indexBefore);
  });
});

describe('confirmNodeCreation', () => {
  it('justAddedNodeId를 초기화한다', () => {
    useMapStore.getState().addNode(makeNode());
    expect(useMapStore.getState().justAddedNodeId).not.toBeNull();
    useMapStore.getState().confirmNodeCreation();
    expect(useMapStore.getState().justAddedNodeId).toBeNull();
  });
});

describe('undo / redo', () => {
  it('undo하면 이전 상태로 돌아간다', () => {
    useMapStore.getState().addNode(makeNode());
    useMapStore.getState().undo();
    expect(useMapStore.getState().nodes).toHaveLength(0);
  });

  it('undo 후 redo하면 다시 복원된다', () => {
    useMapStore.getState().addNode(makeNode());
    useMapStore.getState().undo();
    useMapStore.getState().redo();
    expect(useMapStore.getState().nodes).toHaveLength(1);
  });

  it('historyIndex가 0이면 undo가 동작하지 않는다', () => {
    useMapStore.getState().undo();
    expect(useMapStore.getState().historyIndex).toBe(0);
  });

  it('마지막 히스토리에서 redo가 동작하지 않는다', () => {
    useMapStore.getState().addNode(makeNode());
    const index = useMapStore.getState().historyIndex;
    useMapStore.getState().redo();
    expect(useMapStore.getState().historyIndex).toBe(index);
  });

  it('undo 시 삭제된 노드가 selectedNodeId이면 선택을 해제한다', () => {
    const id = useMapStore.getState().addNode(makeNode());
    useUIStore.setState({ selectedNodeId: id });
    useMapStore.getState().undo();
    expect(useUIStore.getState().selectedNodeId).toBeNull();
  });

  it('undo 시 삭제된 노드가 editingNodeId이면 편집을 해제한다', () => {
    const id = useMapStore.getState().addNode(makeNode());
    useUIStore.setState({ editingNodeId: id });
    useMapStore.getState().undo();
    expect(useUIStore.getState().editingNodeId).toBeNull();
  });
});
