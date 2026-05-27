export function emailInvitacioRegistre(nomAlumne: string): string {
    return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitación a la Zona Alumnos - Autoescola Paris</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F4F6FB;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F6FB;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            
            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,#0110D6,#2563EB);padding:36px 32px;text-align:center;">
                <div style="font-size:40px;margin-bottom:12px;">🎓</div>
                <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                  Autoescola Paris
                </h1>
                <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">
                  Lleida · Mollerussa
                </p>
              </td>
            </tr>
  
            <!-- CONTENIDO -->
            <tr>
              <td style="padding:36px 32px;">
                <h2 style="color:#1e293b;font-size:20px;margin:0 0 8px;font-weight:600;">
                  Hola, ${nomAlumne}! 👋
                </h2>
                <p style="color:#64748b;font-size:15px;line-height:1.6;margin:0 0 24px;">
                  Ya estás autorizado/a para acceder a la zona privada de alumnos de Autoescola Paris.
                  Solo tienes que registrarte para crear tu cuenta y empezar a disfrutar de todos los recursos.
                </p>
  
                <!-- PASOS -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;margin-bottom:16px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <strong style="color:#1e40af;font-size:15px;">¿Cómo acceder?</strong>
                      <ol style="color:#475569;font-size:13px;margin:12px 0 0;padding-left:20px;line-height:2;">
                        <li>Pulsa el botón de abajo</li>
                        <li>Selecciona <strong>Registrarme</strong></li>
                        <li>Rellena tus datos y elige una contraseña</li>
                        <li>¡Listo! Acceso inmediato</li>
                      </ol>
                    </td>
                  </tr>
                </table>
  
                <!-- BOTÓ REGISTRE -->
                <div style="text-align:center;margin-bottom:28px;">
                  <a href="https://app.autoescolaparis.com/alumnes/login" 
                     style="display:inline-block;background:#F59E0B;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:10px;font-size:16px;font-weight:700;">
                    🎓 Crear mi cuenta
                  </a>
                </div>
  
                <!-- CANAL AVISOS -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;margin-bottom:16px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <div style="margin-bottom:8px;">
                        <span style="font-size:24px;margin-right:10px;">📢</span>
                        <strong style="color:#1e40af;font-size:16px;">Canal de Avisos Oficiales</strong>
                      </div>
                      <p style="color:#475569;font-size:13px;margin:0 0 16px;line-height:1.5;">
                        Fechas de exámenes, cambios de horario, noticias importantes y materiales de estudio.
                      </p>
                      <a href="https://t.me/+xqoypdLxpdRjOTZk" 
                         style="display:inline-block;background:#0110D6;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;">
                        📡 Unirme al Canal
                      </a>
                    </td>
                  </tr>
                </table>
  
                <!-- GRUP ALUMNES -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;margin-bottom:8px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <div style="margin-bottom:8px;">
                        <span style="font-size:24px;margin-right:10px;">💬</span>
                        <strong style="color:#166534;font-size:16px;">Grupo de Alumnos</strong>
                      </div>
                      <p style="color:#475569;font-size:13px;margin:0 0 16px;line-height:1.5;">
                        Chat entre alumnos, dudas, consejos y compañía durante el curso.
                      </p>
                      <a href="https://t.me/+wiCHnvYooCMxYzRk" 
                         style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;">
                        👥 Unirme al Grupo
                      </a>
                    </td>
                  </tr>
                </table>
  
                <p style="color:#94a3b8;font-size:12px;text-align:center;margin:20px 0 0;">
                  Si tienes algún problema, contacta con nosotros por WhatsApp.
                </p>
              </td>
            </tr>
  
            <!-- FOOTER -->
            <tr>
              <td style="background:#F8FAFC;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.6;">
                  Autoescola Paris · Lleida y Mollerussa<br>
                  <a href="mailto:hola@autoescolaparis.com" style="color:#0110D6;text-decoration:none;">hola@autoescolaparis.com</a>
                </p>
              </td>
            </tr>
  
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
    `
  }