import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { deleteHorario } from './actions'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export default async function HorariosPage() {
  const supabase = await createSupabaseServerClient()

  const [{ data: horaris }, { data: assistencies }, { data: alumnesInfo }] = await Promise.all([
    supabase.from('horaris').select('*').order('dia_setmana'),
    supabase.from('alumnes_assistencies').select('horari_id, alumne_email'),
    supabase.from('alumnes_autoritzats').select('email, nom'),
  ])

  // Agrupar assistències per horari
  const nomPerEmail = Object.fromEntries(alumnesInfo?.map((a) => [a.email, a.nom]) ?? [])

  const assistenciesPer = (horariId: string) =>
    assistencies?.filter((a) => a.horari_id === horariId) ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Horarios</h1>
        <Link
          href="/admin/horarios/nuevo"
          className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          + Nuevo horario
        </Link>
      </div>

      {!horaris?.length ? (
        <p className="text-zinc-500 text-sm">No hay horarios todavía.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {horaris.map((h) => {
            const llista = assistenciesPer(h.id)
            return (
              <div key={h.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                {/* Capçalera horari */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-zinc-800">
                      {h.dia_setmana} · {h.hora_inici}–{h.hora_fi}
                      {!h.actiu && <span className="ml-2 text-xs text-zinc-400">(inactivo)</span>}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {[h.tipus, h.professor].filter(Boolean).join(' · ')}
                      {h.link_online && (
                        <> · <a href={h.link_online} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Online</a></>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Comptador assistències */}
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${llista.length > 0 ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                      👥 {llista.length} {llista.length === 1 ? 'alumne' : 'alumnes'}
                    </span>
                    <div className="flex gap-3">
                      <Link href={`/admin/horarios/${h.id}`} className="text-sm text-blue-700 hover:underline">
                        Editar
                      </Link>
                      <form action={deleteHorario}>
                        <input type="hidden" name="id" value={h.id} />
                        <button type="submit" className="text-sm text-red-500 hover:underline">
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Llista d'alumnes que assistiran */}
                {llista.length > 0 && (
                  <div className="border-t border-zinc-100 px-5 py-3 bg-green-50">
                    <p className="text-xs font-semibold text-zinc-600 mb-2">Alumnes confirmats:</p>
                    <div className="flex flex-wrap gap-2">
                      {llista.map((a) => (
                        <span key={a.alumne_email} className="text-xs bg-white border border-green-200 text-green-700 px-2.5 py-1 rounded-full">
                          {nomPerEmail[a.alumne_email] ?? a.alumne_email} · {a.alumne_email}

                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
