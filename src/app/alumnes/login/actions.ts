'use server'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { sendTelegramWelcomeEmail } from '@/lib/send-telegram-welcome'  // ← AFEGIT

export async function registreAlumne(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const dni = (formData.get('dni') as string)?.toUpperCase().trim()
  const seu = formData.get('seu') as string
  const supabase = await createSupabaseServerClient()

  // Verificar que l'alumne està autoritzat i no s'ha registrat
  const { data: alumne } = await supabase
    .from('alumnes_autoritzats')
    .select('*')
    .eq('email', email)
    .eq('dni', dni)
    .single()

  if (!alumne) {
    return { error: 'Email o DNI no autoritzat. Contacta amb l\'autoescola.' }
  }

  if (alumne.registrat) {
    return { error: 'Aquest alumne ja s\'ha registrat. Inicia sessió.' }
  }

  // Crear compte a Supabase Auth
  const { error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError) {
    return { error: 'Error al crear el compte: ' + signUpError.message }
  }

  // Marcar com a registrat i guardar seu
  await supabase
    .from('alumnes_autoritzats')
    .update({ registrat: true, data_registre: new Date().toISOString(), seu })
    .eq('id', alumne.id)

  // ← AFEGIT: Enviar email de benvinguda amb links de Telegram
  await sendTelegramWelcomeEmail(email, alumne.nom)

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

  // Verificar que és un alumne (no admin)
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
