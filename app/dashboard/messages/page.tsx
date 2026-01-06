import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import MessagesClient from './MessagesClient';

export default async function MessagesPage() {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/sign-in');
  }

  return <MessagesClient userId={user.id} />;
}
