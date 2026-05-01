'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function toggleAssistencia(horariId: string, assisteix: boolean, email: string) {
  const supabase = await createSupabaseServerClient()

  if (assisteix) {
    await supabase
      .from('alumnes_assistencies')
      .delete()
      .eq('horari_id', horariId)
      .eq('alumne_email', email)
  } else {
    await supabase
      .from('alumnes_assistencies')
      .insert({ horari_id: horariId, alumne_email: email })
  }

  revalidatePath('/alumnes/horaris')
}
