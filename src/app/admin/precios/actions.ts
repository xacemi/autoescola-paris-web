'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function createPreu(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('preus_permisos').insert({
    tipus_permis: formData.get('tipus_permis'),
    descripcio: formData.get('descripcio') || null,
    preu_matricula: parseFloat(formData.get('preu_matricula') as string) || null,
    preu_classe_practica: parseFloat(formData.get('preu_classe_practica') as string) || null,
    preu_total_aproximat: parseFloat(formData.get('preu_total_aproximat') as string) || null,
    inclou: formData.get('inclou') || null,
    actiu: formData.get('actiu') === 'on',
  })
  console.log('createPreu error:', error)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/precios')
  redirect('/admin/precios')
}

export async function updatePreu(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const id = formData.get('id') as string
  const { error } = await supabase.from('preus_permisos').update({
    tipus_permis: formData.get('tipus_permis'),
    descripcio: formData.get('descripcio') || null,
    preu_matricula: parseFloat(formData.get('preu_matricula') as string) || null,
    preu_classe_practica: parseFloat(formData.get('preu_classe_practica') as string) || null,
    preu_total_aproximat: parseFloat(formData.get('preu_total_aproximat') as string) || null,
    inclou: formData.get('inclou') || null,
    actiu: formData.get('actiu') === 'on',
  }).eq('id', id)
  console.log('updatePreu error:', error)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/precios')
  redirect('/admin/precios')
}

export async function deletePreu(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const id = formData.get('id') as string
  await supabase.from('preus_permisos').delete().eq('id', id)
  revalidatePath('/admin/precios')
  redirect('/admin/precios')
}
