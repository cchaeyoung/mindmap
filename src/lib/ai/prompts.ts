export const generateMindmapPrompt = (topic: string) => `
Create a mindmap for: "${topic}".
Think like an expert making a study guide — break the topic into all major aspects, then drill into specific concepts, tools, techniques, and examples.

Structure rules:
- Root node: exactly ONE node, aiId "root", parentAiId null
- Level-1 nodes: direct children of root, evenly split direction "left" / "right"
- All deeper nodes: direction must match their level-1 ancestor exactly

Node rules:
- aiId: unique string per node (e.g. "node-1", "node-2", ...)
- label: concise noun or phrase, max 15 characters
- Every node must carry meaningful information — avoid generic labels like "Overview" or "Details"
`;
