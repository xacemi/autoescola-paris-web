import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { sendTelegramWelcomeEmail } from '@/lib/send-telegram-welcome'

export const dynamic = 'force-dynamic'

async function afegirAlumne(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_autoritzats').insert({
    nom: formData.get('nom'),
    email: formData.get('email'),
    dni: (formData.get('dni') as string)?.toUpperCase(),
    aprovat: true,
  })
  revalidatePath('/admin/alumnos')
}

async function eliminarAlumne(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_autoritzats').delete().eq('id', id)
  revalidatePath('/admin/alumnos')
}

async function aprovarAlumne(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()

  const { data: alumne } = await supabase
    .from('alumnes_autoritzats')
    .select('email, nom')
    .eq('id', id)
    .single()

  await supabase
    .from('alumnes_autoritzats')
    .update({ aprovat: true })
    .eq('id', id)

  if (alumne?.email && alumne?.nom) {
    await sendTelegramWelcomeEmail(alumne.email, alumne.nom)
  }

  revalidatePath('/admin/alumnos')
}

async function rebutjarAlumne(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_autoritzats').delete().eq('id', id)
  revalidatePath('/admin/alumnos')
}

export default async function AlumnosPage() {
  const supabase = await createSupabaseServerClient()
  const { data: alumnes } = await supabase
    .from('alumnes_autoritzats')
    .select('*')
    .order('data_alta', { ascending: false })

  const total = alumnes?.length ?? 0
  const aprovats = alumnes?.filter((a) => a.aprovat).length ?? 0
  const pendents = alumnes?.filter((a) => a.registrat && !a.aprovat).length ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Alumnos</h1>

      {/* Estadístiques */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Aprovats', value: aprovats, color: 'bg-green-50 text-green-700' },
          { label: 'Pendents', value: pendents, color: 'bg-amber-50 text-amber-700' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Formulari afegir alumne */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm mb-8">
        <h2 className="text-base font-bold text-zinc-800 mb-4">Añadir alumno autorizado</h2>
        <form action={afegirAlumne} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <div className="sm:col-span-3">
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
              + Añadir alumno
            </button>
          </div>
        </form>
      </div>

      {/* Llista d'alumnes */}
      {!alumnes?.length ? (
        <p className="text-sm text-zinc-500">No hay alumnos todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {alumnes.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm flex items-center gap-4 flex-wrap">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                a.aprovat ? 'bg-green-100' : a.registrat ? 'bg-amber-100' : 'bg-zinc-100'
              }`}>
                <span className="text-lg">{a.aprovat ? '✅' : a.registrat ? '⏳' : '📋'}</span>
              </div>

              <div className="flex-1">
                <p className="font-semibold text-zinc-800 text-sm">{a.nom}</p>
                <p className="text-xs text-blue-600">{a.email}</p>
                {a.dni && <p className="text-xs text-zinc-400">DNI: {a.dni}</p>}
                {a.seu && <p className="text-xs text-zinc-400">Seu: {a.seu}</p>}
              </div>

              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                a.aprovat ? 'bg-green-100 text-green-700' :
                a.registrat ? 'bg-amber-100 text-amber-700' :
                'bg-zinc-100 text-zinc-600'
              }`}>
                {a.aprovat ? 'Aprovat' : a.registrat ? 'Pendent aprovació' : 'No registrat'}
              </span>

              <p className="text-xs text-zinc-400 whitespace-nowrap">
                {new Date(a.data_alta).toLocaleDateString('es-ES')}
              </p>

              <div className="flex gap-2 flex-wrap">
                {a.registrat && !a.aprovat && (
                  <form action={aprovarAlumne.bind(null, a.id)}>
                    <button type="submit"
                      className="bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-green-200">
                      ✅ Aprovar
                    </button>
                  </form>
                )}
                {a.registrat && !a.aprovat && (
                  <form action={rebutjarAlumne.bind(null, a.id)}>
                    <button type="submit"
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-red-200">
                      ❌ Rebutjar
                    </button>
                  </form>
                )}
                <form action={eliminarAlumne.bind(null, a.id)}>
                  <button type="submit"
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-red-200">
                    🗑️ Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
