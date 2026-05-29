import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { mindmapSchema } from '@/lib/ai/schema';
import { generateMindmapPrompt } from '@/lib/ai/prompts';

export async function POST(req: Request) {
  const { topic } = await req.json();
  const { output } = await generateText({
    model: google('gemini-3.1-flash-lite-preview'),
    output: Output.object({ schema: mindmapSchema }),
    prompt: generateMindmapPrompt(topic),
    abortSignal: req.signal,
  });
  return Response.json(output);
}
