'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function createHorario(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('horaris').insert({
    data: formData.get('data'),
    hora_inici: formData.get('hora_inici'),
    hora_fi: formData.get('hora_fi'),
    tipus: formData.get('tipus'),
    professor: formData.get('professor'),
    link_online: formData.get('link_online') || null,
    actiu: formData.get('actiu') === 'on',
  })
  console.log('createHorario error:', error)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/horarios')
  redirect('/admin/horarios')
}

export async function updateHorario(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const id = formData.get('id') as string
  const { error } = await supabase.from('horaris').update({
    data: formData.get('data'),
    hora_inici: formData.get('hora_inici'),
    hora_fi: formData.get('hora_fi'),
    tipus: formData.get('tipus'),
    professor: formData.get('professor'),
    link_online: formData.get('link_online') || null,
    actiu: formData.get('actiu') === 'on',
  }).eq('id', id)
  console.log('updateHorario error:', error)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/horarios')
  redirect('/admin/horarios')
}

export async function deleteHorario(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const id = formData.get('id') as string
  await supabase.from('horaris').delete().eq('id', id)
  revalidatePath('/admin/horarios')
  redirect('/admin/horarios')
}