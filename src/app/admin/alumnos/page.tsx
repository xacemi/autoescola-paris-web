import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

async function afegirAlumne(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_autoritzats').insert({
    nom: formData.get('nom'),
    email: formData.get('email'),
    dni: (formData.get('dni') as string)?.toUpperCase(),
  })
  revalidatePath('/admin/alumnos')
}

async function eliminarAlumne(id: string) {
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
  const registrats = alumnes?.filter((a) => a.registrat).length ?? 0
  const pendents = total - registrats

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Alumnos autorizados</h1>

      {/* Estadístiques */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Registrados', value: registrats, color: 'bg-green-50 text-green-700' },
          { label: 'Pendientes', value: pendents, color: 'bg-amber-50 text-amber-700' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Formulari d'afegir alumne */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm mb-8">
        <h2 className="text-base font-bold text-zinc-800 mb-4">Añadir alumno autorizado</h2>
        <form action={afegirAlumne} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Nombre completo *</label>
            <input
              name="nom"
              required
              placeholder="Juan García López"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Email *</label>
            <input
              name="email"
              type="email"
              required
              placeholder="alumno@email.com"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">DNI *</label>
            <input
              name="dni"
              required
              placeholder="12345678A"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
            >
              + Añadir alumno
            </button>
          </div>
        </form>
      </div>

      {/* Llista d'alumnes */}
      {!alumnes?.length ? (
        <p className="text-sm text-zinc-500">No hay alumnos autorizados todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {alumnes.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm flex items-center gap-4">
              {/* Estat */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${a.registrat ? 'bg-green-100' : 'bg-amber-100'}`}>
                <span className="text-lg">{a.registrat ? '✅' : '⏳'}</span>
              </div>

              {/* Dades */}
              <div className="flex-1">
                <p className="font-semibold text-zinc-800 text-sm">{a.nom}</p>
                <p className="text-xs text-blue-600">{a.email}</p>
                <p className="text-xs text-zinc-400">DNI: {a.dni}</p>
              </div>

              {/* Estat badge */}
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.registrat ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {a.registrat ? 'Registrado' : 'Pendiente'}
              </span>

              {/* Data */}
              <p className="text-xs text-zinc-400 whitespace-nowrap">
                {new Date(a.data_alta).toLocaleDateString('es-ES')}
              </p>

              {/* Eliminar */}
              <form action={eliminarAlumne.bind(null, a.id)}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-red-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
