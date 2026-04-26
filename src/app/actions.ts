'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function enviarContacte(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('contactes').insert({
    nom: formData.get('nom'),
    email: formData.get('email'),
    telefon: formData.get('telefon') || null,
    missatge: formData.get('missatge'),
    permis_interes: formData.get('permis_interes') || null,
    llegit: false,
  })
  if (error) throw new Error(error.message)
  redirect('/?enviat=1')
}
