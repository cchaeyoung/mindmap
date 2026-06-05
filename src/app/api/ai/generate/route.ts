import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { mindmapSchema } from '@/lib/ai/schema';
import { generateMindmapPrompt } from '@/lib/ai/prompts';

const topicSchema = z.string().trim().min(1).max(200);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
  const parsed = topicSchema.safeParse((body as Record<string, unknown>)?.topic);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid topic' }), { status: 400 });
  }
  const topic = parsed.data;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const result = streamObject({
        model: google('gemini-3.1-flash-lite'),
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
            (node.parentAiId === null ||
              node.direction ||
              (node.parentAiId !== 'root' && sentIds.has(node.parentAiId))) &&
            !sentIds.has(node.aiId) &&
            (node.parentAiId === null || sentIds.has(node.parentAiId))
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
