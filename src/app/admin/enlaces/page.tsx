import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

async function afegirEnllac(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_enllacos').insert({
    titol: formData.get('titol'),
    url: formData.get('url'),
    posicio: Number(formData.get('posicio')) || 0,
    actiu: true,
  })
  revalidatePath('/admin/enlaces')
}

async function eliminarEnllac(id: number) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_enllacos').delete().eq('id', id)
  revalidatePath('/admin/enlaces')
}

async function toggleActiu(id: number, actiu: boolean) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_enllacos').update({ actiu: !actiu }).eq('id', id)
  revalidatePath('/admin/enlaces')
}

export default async function EnlacesPage() {
  const supabase = await createSupabaseServerClient()
  const { data: enllacos } = await supabase
    .from('alumnes_enllacos')
    .select('*')
    .order('posicio', { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Enlaces para alumnos</h1>

      {/* Formulari afegir */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm mb-8">
        <h2 className="text-base font-bold text-zinc-800 mb-4">Añadir enlace</h2>
        <form action={afegirEnllac} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Título *</label>
            <input name="titol" required placeholder="Facilauto (WEB)"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Posición</label>
            <input name="posicio" type="number" placeholder="1"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">URL *</label>
            <input name="url" type="url" required placeholder="https://..."
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-3">
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
              + Añadir enlace
            </button>
          </div>
        </form>
      </div>

      {/* Llista d'enllaços */}
      {!enllacos?.length ? (
        <p className="text-sm text-zinc-500">No hay enlaces todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {enllacos.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm flex items-center gap-4 flex-wrap">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-600">{e.posicio}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-800 text-sm">{e.titol}</p>
                <p className="text-xs text-blue-500 truncate">{e.url}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                e.actiu ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
              }`}>
                {e.actiu ? 'Activo' : 'Inactivo'}
              </span>
              <div className="flex gap-2">
                <form action={toggleActiu.bind(null, e.id, e.actiu)}>
                  <button type="submit"
                    className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors border ${
                      e.actiu
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                    }`}>
                    {e.actiu ? '⏸️ Desactivar' : '▶️ Activar'}
                  </button>
                </form>
                <form action={eliminarEnllac.bind(null, e.id)}>
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
