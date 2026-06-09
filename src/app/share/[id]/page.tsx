import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ShareViewer from '@/components/share/ShareViewer';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('maps')
    .select('title, nodes, edges')
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (!data) notFound();

  return <ShareViewer nodes={data.nodes} edges={data.edges} title={data.title} />;
}
