'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function crearInformacio(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_informacio').insert({
    titol: formData.get('titol'),
    contingut: formData.get('contingut'),
    ordre: Number(formData.get('ordre')) || 0,
    actiu: formData.get('actiu') === 'on',
  })
  revalidatePath('/admin/informacio')
  redirect('/admin/informacio')
}

export async function eliminarInformacio(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_informacio').delete().eq('id', id)
  revalidatePath('/admin/informacio')
}
