'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function createUbicacio(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('ubicacions').insert({
    categoria: formData.get('categoria'),
    label: formData.get('label'),
    adreca: formData.get('adreca') || null,
    url_maps: formData.get('url_maps'),
    ordre: parseInt(formData.get('ordre') as string) || 0,
    actiu: formData.get('actiu') === 'on',
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/ubicaciones')
  redirect('/admin/ubicaciones')
}

export async function updateUbicacio(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const id = formData.get('id') as string
  const { error } = await supabase.from('ubicacions').update({
    categoria: formData.get('categoria'),
    label: formData.get('label'),
    adreca: formData.get('adreca') || null,
    url_maps: formData.get('url_maps'),
    ordre: parseInt(formData.get('ordre') as string) || 0,
    actiu: formData.get('actiu') === 'on',
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/ubicaciones')
  redirect('/admin/ubicaciones')
}

export async function deleteUbicacio(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const id = formData.get('id') as string
  await supabase.from('ubicacions').delete().eq('id', id)
  revalidatePath('/admin/ubicaciones')
  redirect('/admin/ubicaciones')
}