// lib/send-telegram-welcome.ts
// Funció per enviar l'email de benvinguda amb links de Telegram
// S'utilitza des de l'action de registre d'alumnes

import { Resend } from 'resend'
import { emailTelegramBenvinguda } from './emails/telegram-benvinguda'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTelegramWelcomeEmail(
  emailAlumne: string,
  nomAlumne: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: 'Autoescola Paris <hola@autoescolaparis.com>',
      to: emailAlumne,
      subject: '🎓 Benvingut/da! Uneix-te als grups de Telegram',
      html: emailTelegramBenvinguda(nomAlumne),
    })

    return { success: true }
  } catch (error) {
    console.error('Error enviant email de Telegram:', error)
    return { success: false, error: String(error) }
  }
}
