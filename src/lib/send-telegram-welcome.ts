// lib/send-telegram-welcome.ts
// Envia l'email de benvinguda amb links de Telegram via Amazon SES

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { emailTelegramBenvinguda } from './emails/telegram-benvinguda'

const ses = new SESClient({
  region: process.env.AWS_REGION ?? 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function sendTelegramWelcomeEmail(
  emailAlumne: string,
  nomAlumne: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await ses.send(new SendEmailCommand({
      Source: 'Autoescola Paris <hola@autoescolaparis.com>',
      Destination: {
        ToAddresses: [emailAlumne],
      },
      Message: {
        Subject: {
          Data: '🎓 ¡Bienvenido/a! Únete a los grupos de Telegram',
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: emailTelegramBenvinguda(nomAlumne),
            Charset: 'UTF-8',
          },
        },
      },
    }))

    return { success: true }
  } catch (error) {
    console.error('Error enviant email SES:', error)
    return { success: false, error: String(error) }
  }
}
