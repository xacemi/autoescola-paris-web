'use server'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { sendTelegramWelcomeEmail } from '@/lib/send-telegram-welcome'

export async function registreAlumne(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const dni = (formData.get('dni') as string)?.toUpperCase().trim()
  const seu = formData.get('seu') as string
  const supabase = await createSupabaseServerClient()

  const { data: alumne } = await supabase
    .from('alumnes_autoritzats')
    .select('*')
    .eq('email', email)
    .single()

  if (!alumne) {
    return { error: 'Email o DNI no autoritzat. Contacta amb l\'autoescola.' }
  }

  if (alumne.registrat) {
    return { error: 'Aquest alumne ja s\'ha registrat. Inicia sessió.' }
  }

  const { error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError) {
    return { error: 'Error al crear el compte: ' + signUpError.message }
  }

  await supabase
    .from('alumnes_autoritzats')
    .update({ registrat: true, data_registre: new Date().toISOString(), seu })
    .eq('id', alumne.id)

  // Enviar email amb logs per debugar
  console.log('📧 Enviant email a:', email, '| Nom:', alumne.nom)
  const resultat = await sendTelegramWelcomeEmail(email, alumne.nom)
  console.log('📧 Resultat email:', JSON.stringify(resultat))

  redirect('/alumnes')
}

export async function loginAlumne(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: 'Credencials incorrectes' }
  }

  const { data: alumne } = await supabase
    .from('alumnes_autoritzats')
    .select('*')
    .eq('email', email)
    .single()

  if (!alumne) {
    await supabase.auth.signOut()
    return { error: 'Aquest compte no és un alumne autoritzat.' }
  }

  redirect('/alumnes')
}

export async function logoutAlumne() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/alumnes/login')
}
