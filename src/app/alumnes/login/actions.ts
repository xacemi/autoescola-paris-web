'use server'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function registreAlumne(_: unknown, formData: FormData) {
  const email = (formData.get('email') as string)?.toLowerCase().trim()
  const password = formData.get('password') as string
  const nom = (formData.get('nom') as string)?.trim()
  const dni = (formData.get('dni') as string)?.toUpperCase().trim()
  const seu = formData.get('seu') as string
  const supabase = await createSupabaseServerClient()

  // Comprovar si ja existeix a la taula
  const { data: existent } = await supabase
    .from('alumnes_autoritzats')
    .select('id, registrat')
    .eq('email', email)
    .single()

  if (existent?.registrat) {
    return { error: 'Este email ya tiene una cuenta. Inicia sesión.' }
  }

  // Crear compte a Supabase Auth
  const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError && signUpError.message !== 'User already registered') {
    return { error: 'Error al crear la cuenta: ' + signUpError.message }
  }

  if (existent) {
    // Actualitzar registre existent a la taula
    await supabase
      .from('alumnes_autoritzats')
      .update({
        registrat: true,
        aprovat: false,
        nom,
        dni,
        data_registre: new Date().toISOString(),
        seu
      })
      .eq('id', existent.id)
  } else {
    // Crear nou registre — tant si és nou a Auth com si ja existia
    await supabase
      .from('alumnes_autoritzats')
      .insert({
        nom,
        email,
        dni,
        registrat: true,
        aprovat: false,
        data_registre: new Date().toISOString(),
        seu
      })
  }

  // Notificació a Xavi via Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (botToken && chatId) {
    const missatge = `🆕 Nuevo alumno registrado!\n\n👤 Nombre: ${nom}\n📧 Email: ${email}\n🪪 DNI: ${dni}\n🏫 Sede: ${seu}\n\nAprúebalo desde el panel admin:\nhttps://app.autoescolaparis.com/admin/alumnos`
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: missatge })
    })
  }

  redirect('/alumnes/pendent')
}

export async function loginAlumne(_: unknown, formData: FormData) {
  const email = (formData.get('email') as string)?.toLowerCase().trim()
  const password = formData.get('password') as string
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: 'Credenciales incorrectas' }
  }

  // Verificar que és alumne
  const { data: alumne } = await supabase
    .from('alumnes_autoritzats')
    .select('aprovat')
    .eq('email', email)
    .single()

  if (!alumne) {
    await supabase.auth.signOut()
    return { error: 'Esta cuenta no es un alumno autorizado.' }
  }

  if (!alumne.aprovat) {
    await supabase.auth.signOut()
    return { error: 'Tu cuenta está pendiente de aprobación. Pronto recibirás una respuesta.' }
  }

  redirect('/alumnes')
}

export async function logoutAlumne() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/alumnes/login')
}
