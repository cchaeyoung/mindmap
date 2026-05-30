import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { mindmapSchema } from '@/lib/ai/schema';
import { generateMindmapPrompt } from '@/lib/ai/prompts';

export async function POST(req: Request) {
  const { topic } = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const result = streamObject({
        model: google('gemini-3.5-flash'),
        schema: mindmapSchema,
        prompt: generateMindmapPrompt(topic),
        abortSignal: req.signal,
      });

      const sentIds = new Set<string>();
      for await (const partial of result.partialObjectStream) {
        const nodes = partial.nodes ?? [];
        for (const node of nodes) {
          if (
            node?.aiId &&
            node?.label &&
            node.parentAiId !== undefined &&
            !sentIds.has(node.aiId)
          ) {
            sentIds.add(node.aiId);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(node)}\n\n`));
          }
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
