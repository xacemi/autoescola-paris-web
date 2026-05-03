'use server'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function registreAlumne(_: unknown, formData: FormData) {
  const email = (formData.get('email') as string)?.toLowerCase().trim()
  const password = formData.get('password') as string
  const nom = (formData.get('nom') as string)?.trim()
  const seu = formData.get('seu') as string
  const supabase = await createSupabaseServerClient()

  // Comprovar si ja existeix a la taula
  const { data: existent } = await supabase
    .from('alumnes_autoritzats')
    .select('id, registrat')
    .eq('email', email)
    .single()

  if (existent?.registrat) {
    return { error: 'Aquest email ja té un compte. Inicia sessió.' }
  }

  // Crear compte a Supabase Auth
  const { error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError) {
    return { error: 'Error al crear el compte: ' + signUpError.message }
  }

  if (existent) {
    // Actualitzar registre existent
    await supabase
      .from('alumnes_autoritzats')
      .update({ 
        registrat: true, 
        aprovat: false,
        data_registre: new Date().toISOString(), 
        seu 
      })
      .eq('id', existent.id)
  } else {
    // Crear nou registre pendent
    await supabase
      .from('alumnes_autoritzats')
      .insert({ 
        nom,
        email, 
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
    const missatge = `🆕 Nou alumne registrat!\n\n👤 Nom: ${nom}\n📧 Email: ${email}\n🏫 Seu: ${seu}\n\nAprova'l des del panel admin:\nhttps://app.autoescolaparis.com/admin/alumnos`
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
    return { error: 'Credencials incorrectes' }
  }

  // Verificar que és alumne
  const { data: alumne } = await supabase
    .from('alumnes_autoritzats')
    .select('aprovat')
    .eq('email', email)
    .single()

  if (!alumne) {
    await supabase.auth.signOut()
    return { error: 'Aquest compte no és un alumne autoritzat.' }
  }

  if (!alumne.aprovat) {
    await supabase.auth.signOut()
    return { error: 'El teu compte està pendent d\'aprovació. Aviat rebràs una resposta.' }
  }

  redirect('/alumnes')
}

export async function logoutAlumne() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/alumnes/login')
}
