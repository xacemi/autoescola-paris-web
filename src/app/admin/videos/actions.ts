'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function crearVideo(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_videos').insert({
    titol: formData.get('titol'),
    descripcio: formData.get('descripcio') || null,
    url_youtube: formData.get('url_youtube'),
    data_classe: formData.get('data_classe') || null,
    actiu: formData.get('actiu') === 'on',
  })
  revalidatePath('/admin/videos')
  redirect('/admin/videos')
}

export async function eliminarVideo(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_videos').delete().eq('id', id)
  revalidatePath('/admin/videos')
}

export async function toggleVideo(id: string, actiu: boolean) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_videos').update({ actiu }).eq('id', id)
  revalidatePath('/admin/videos')
}
