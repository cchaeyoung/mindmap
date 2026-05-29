export const generateMindmapPrompt = (topic: string) => `
Generate a mindmap for the topic: "${topic}".

Structure:
- Root node: aiId "root", parentAiId null, no direction field
- Level-1 nodes (direct children of root): evenly split between direction "left" and "right"
- All other nodes: set direction to match their level-1 ancestor's direction

Guidelines:
- aiId must be unique across all nodes (e.g. "node-1", "node-2")
- parentAiId must reference an existing aiId in the same response
- label: concise noun or short phrase, under 15 characters
- Number of nodes: choose naturally based on the topic
`;
