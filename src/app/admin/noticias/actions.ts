'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function createNoticia(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('noticies').insert({
    titol: formData.get('titol'),
    contingut: formData.get('contingut'),
    publicada: formData.get('publicada') === 'on',
    data_publicacio: new Date().toISOString(),
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/noticias')
  revalidatePath('/')
  redirect('/admin/noticias')
}

export async function updateNoticia(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const id = formData.get('id') as string
  const { error } = await supabase.from('noticies').update({
    titol: formData.get('titol'),
    contingut: formData.get('contingut'),
    publicada: formData.get('publicada') === 'on',
  }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/noticias')
  revalidatePath('/')
  redirect('/admin/noticias')
}

export async function deleteNoticia(id: string) {
  const supabase = await createSupabaseServerClient()
  await supabase.from('noticies').delete().eq('id', id)
  revalidatePath('/admin/noticias')
  revalidatePath('/')
}
