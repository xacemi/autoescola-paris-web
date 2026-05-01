import { createSupabaseServerClient } from '@/lib/supabase-server'
import AssistenciaButton from './AssistenciaButton'
import { toggleAssistencia } from './actions'

export const dynamic = 'force-dynamic'

export default async function AlumnesHorarisPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: horaris }, { data: assistencies }] = await Promise.all([
    supabase.from('horaris').select('*').eq('actiu', true).order('dia_setmana'),
    supabase.from('alumnes_assistencies').select('horari_id').eq('alumne_email', user!.email!),
  ])

  const assistenciesSet = new Set(assistencies?.map((a) => a.horari_id) ?? [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-800">📅 Horaris de classe</h1>
        <p className="text-sm text-zinc-500 mt-1">Confirma la teva assistència a cada classe</p>
      </div>

      {!horaris?.length ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-zinc-100">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-zinc-500 text-sm">Encara no hi ha horaris disponibles.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {horaris.map((h) => {
            const assisteix = assistenciesSet.has(h.id)
            return (
              <div key={h.id} className="bg-white rounded-2xl border border-zinc-100 px-5 py-4 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0110D6] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{h.dia_setmana?.slice(0, 3).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1F2937] text-sm">{h.dia_setmana}</p>
                    <p className="text-xs text-zinc-500">{h.hora_inici} – {h.hora_fi}</p>
                    {h.tipus && <p className="text-xs text-zinc-400">{h.tipus}</p>}
                  </div>
                </div>
                <AssistenciaButton
                  horariId={h.id}
                  assisteix={assisteix}
                  action={toggleAssistencia.bind(null, h.id, assisteix, user!.email!)}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
