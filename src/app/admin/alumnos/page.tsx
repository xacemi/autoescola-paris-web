import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { sendTelegramWelcomeEmail } from '@/lib/send-telegram-welcome'
import { emailInvitacioRegistre } from '@/lib/emails/invitacio-registre'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import Link from 'next/link'
import { InvitacioButton, EliminarButton } from './EliminarButton'

export const dynamic = 'force-dynamic'

function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function afegirAlumne(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_autoritzats').insert({
    nom: formData.get('nom'),
    email: formData.get('email'),
    dni: (formData.get('dni') as string)?.toUpperCase(),
    seu: formData.get('seu'),
    aprovat: true,
    registrat: false,
    data_alta: new Date().toISOString(),
  })
  revalidatePath('/admin/alumnos')
}

async function eliminarAlumne(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()
  const supabaseAdmin = createSupabaseAdmin()
  const { data: alumne } = await supabase.from('alumnes_autoritzats').select('email').eq('id', id).single()
  await supabase.from('alumnes_autoritzats').delete().eq('id', id)
  if (alumne?.email) {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers()
    const user = users?.users?.find((u) => u.email === alumne.email)
    if (user) await supabaseAdmin.auth.admin.deleteUser(user.id)
  }
  revalidatePath('/admin/alumnos')
}

async function aprovarAlumne(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()
  const { data: alumne } = await supabase.from('alumnes_autoritzats').select('email, nom').eq('id', id).single()
  await supabase.from('alumnes_autoritzats').update({ aprovat: true }).eq('id', id)
  if (alumne?.email && alumne?.nom) await sendTelegramWelcomeEmail(alumne.email, alumne.nom)
  revalidatePath('/admin/alumnos')
}

async function rebutjarAlumne(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()
  const supabaseAdmin = createSupabaseAdmin()
  const { data: alumne } = await supabase.from('alumnes_autoritzats').select('email').eq('id', id).single()
  await supabase.from('alumnes_autoritzats').delete().eq('id', id)
  if (alumne?.email) {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers()
    const user = users?.users?.find((u) => u.email === alumne.email)
    if (user) await supabaseAdmin.auth.admin.deleteUser(user.id)
  }
  revalidatePath('/admin/alumnos')
}

async function enviarInvitacio(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()
  const { data: alumne } = await supabase
    .from('alumnes_autoritzats')
    .select('email, nom')
    .eq('id', id)
    .single()

  if (!alumne?.email || !alumne?.nom) return

  const ses = new SESClient({
    region: process.env.AWS_REGION ?? 'eu-west-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })

  await ses.send(new SendEmailCommand({
    Source: 'Autoescola Paris <hola@autoescolaparis.com>',
    Destination: { ToAddresses: [alumne.email] },
    Message: {
      Subject: { Data: '¡Ya puedes acceder a la Zona Alumnos de Autoescola Paris!' },
      Body: { Html: { Data: emailInvitacioRegistre(alumne.nom) } },
    },
  }))

  revalidatePath('/admin/alumnos')
}

const sedes = ['Todas', 'Lleida', 'Mollerussa', 'Online']

export default async function AlumnosPage({
  searchParams,
}: {
  searchParams: Promise<{ sede?: string }>
}) {
  const supabase = await createSupabaseServerClient()
  const { sede } = await searchParams
  const sedeFiltro = sede ?? 'Todas'

  let query = supabase.from('alumnes_autoritzats').select('*').order('data_alta', { ascending: false })
  if (sedeFiltro !== 'Todas') {
    query = query.eq('seu', sedeFiltro)
  }
  const { data: alumnes } = await query

  const total = alumnes?.length ?? 0
  const aprovats = alumnes?.filter((a) => a.aprovat).length ?? 0
  const pendents = alumnes?.filter((a) => a.registrat && !a.aprovat).length ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Alumnos</h1>

      {/* Estadístiques */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Aprobados', value: aprovats, color: 'bg-green-50 text-green-700' },
          { label: 'Pendientes', value: pendents, color: 'bg-amber-50 text-amber-700' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtre per sede */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sedes.map((sede) => (
          <Link
            key={sede}
            href={sede === 'Todas' ? '/admin/alumnos' : `/admin/alumnos?sede=${sede}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${sedeFiltro === sede
                ? 'bg-blue-600 text-white'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:border-blue-400'
              }`}
          >
            {sede === 'Todas' ? '🌐 Todas' :
              sede === 'Lleida' ? '📍 Lleida' :
                sede === 'Mollerussa' ? '📍 Mollerussa' : '💻 Online'}
          </Link>
        ))}
      </div>

      {/* Formulari afegir alumne */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm mb-6">
        <h2 className="text-base font-bold text-zinc-800 mb-4">Añadir alumno autorizado</h2>
        <form action={afegirAlumne} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Nombre completo *</label>
            <input name="nom" required placeholder="Juan García López"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Email *</label>
            <input name="email" type="email" required placeholder="alumno@email.com"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">DNI *</label>
            <input name="dni" required placeholder="12345678A"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Sede *</label>
            <select name="seu" required
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecciona sede</option>
              <option value="Lleida">Lleida</option>
              <option value="Mollerussa">Mollerussa</option>
              <option value="Online">Online</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
              + Añadir alumno
            </button>
          </div>
        </form>
      </div>

      {/* Llista d'alumnes */}
      {!alumnes?.length ? (
        <p className="text-sm text-zinc-500">No hay alumnos{sedeFiltro !== 'Todas' ? ` en ${sedeFiltro}` : ''} todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {alumnes.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm flex items-center gap-4 flex-wrap">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${a.aprovat ? 'bg-green-100' : a.registrat ? 'bg-amber-100' : 'bg-zinc-100'
                }`}>
                <span className="text-lg">{a.aprovat ? '✅' : a.registrat ? '⏳' : '📋'}</span>
              </div>

              <div className="flex-1">
                <p className="font-semibold text-zinc-800 text-sm">{a.nom}</p>
                <p className="text-xs text-blue-600">{a.email}</p>
                {a.dni && <p className="text-xs text-zinc-400">DNI: {a.dni}</p>}
                {a.seu && <p className="text-xs text-zinc-400">Sede: {a.seu}</p>}
              </div>

              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${a.aprovat && a.registrat ? 'bg-green-100 text-green-700' :
                  a.aprovat && !a.registrat ? 'bg-blue-100 text-blue-700' :
                  a.registrat ? 'bg-amber-100 text-amber-700' :
                    'bg-zinc-100 text-zinc-600'
                }`}>
                {a.aprovat && a.registrat ? 'Aprobado' :
                  a.aprovat && !a.registrat ? 'Pendiente registro' :
                  a.registrat ? 'Pendiente aprobación' : 'No registrado'}
              </span>

              <p className="text-xs text-zinc-400 whitespace-nowrap">
                {new Date(a.data_alta).toLocaleDateString('es-ES')}
              </p>

              <div className="flex gap-2 flex-wrap">
                {/* Enviar invitació — alumnes aprovats però no registrats */}
                {a.aprovat && !a.registrat && (
  <InvitacioButton action={enviarInvitacio.bind(null, a.id)} />
)}
                {a.registrat && !a.aprovat && (
                  <form action={aprovarAlumne.bind(null, a.id)}>
                    <button type="submit"
                      className="bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-green-200">
                      ✅ Aprobar
                    </button>
                  </form>
                )}
                {a.registrat && !a.aprovat && (
                  <form action={rebutjarAlumne.bind(null, a.id)}>
                    <button type="submit"
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-red-200">
                      ❌ Rechazar
                    </button>
                  </form>
                )}
                <EliminarButton action={eliminarAlumne.bind(null, a.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}