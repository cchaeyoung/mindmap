import z from 'zod';

export const mindmapSchema = z.object({
  nodes: z.array(
    z.object({
      aiId: z.string(),
      label: z.string(),
      parentAiId: z.string().nullable(),
      direction: z.enum(['left', 'right']).optional(),
    })
  ),
});
