import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ShareViewer from '@/components/share/ShareViewer';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('maps')
    .select('title')
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (error || !data) return {};

  return {
    title: data.title,
    openGraph: {
      title: data.title,
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('maps')
    .select('title, nodes, edges')
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (error || !data) notFound();

  return <ShareViewer nodes={data.nodes} edges={data.edges} title={data.title} />;
}
