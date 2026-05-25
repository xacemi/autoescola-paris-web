import { createSupabaseServerClient } from '@/lib/supabase-server'

export const revalidate = 0

const CATEGORIES = [
  { key: 'examens', emoji: '🚦', title: 'Zonas de Examen' },
  { key: 'pistes', emoji: '🏁', title: 'Pistas de Prácticas' },
  { key: 'oficines', emoji: '🏢', title: 'Nuestras Oficinas' },
]

export default async function AlumnesUbicacionsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: ubicacions } = await supabase
    .from('ubicacions')
    .select('*')
    .eq('actiu', true)
    .order('ordre')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-800">🗺️ Ubicaciones</h1>
        <p className="text-sm text-zinc-500 mt-1">Zonas de examen, pistas y oficinas</p>
      </div>

      <div className="flex flex-col gap-3">
        {CATEGORIES.map(({ key, emoji, title }) => {
          const llocs = ubicacions?.filter((u) => u.categoria === key) ?? []
          return (
            <details key={key} className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden group">
              <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none">
                <span className="text-2xl">{emoji}</span>
                <span className="font-bold text-[#1F2937] flex-1">{title}</span>
                <svg className="w-5 h-5 text-[#0110D6] transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="flex flex-col gap-2 px-4 pb-4">
                {llocs.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-2">No hay ubicaciones en esta categoría.</p>
                ) : (
                  llocs.map((loc) => (
                    <a key={loc.id} href={loc.url_maps} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 rounded-xl px-4 py-3 transition-colors">
                      <span className="text-lg">📍</span>
                      <div className="flex-1">
                        <p className="font-semibold text-[#1F2937] text-sm">{loc.label}</p>
                        {loc.adreca && <p className="text-xs text-zinc-500">{loc.adreca}</p>}
                      </div>
                      <svg className="w-4 h-4 text-[#0110D6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))
                )}
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}