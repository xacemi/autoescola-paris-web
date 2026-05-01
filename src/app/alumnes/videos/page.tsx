import { createSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default async function AlumnesVideosPage() {
  const supabase = await createSupabaseServerClient()
  const { data: videos } = await supabase
    .from('alumnes_videos')
    .select('*')
    .eq('actiu', true)
    .order('data_classe', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-800">🎬 Vídeos de classes</h1>
        <p className="text-sm text-zinc-500 mt-1">Repeticions de les classes en línia</p>
      </div>

      {!videos?.length ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-zinc-100">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-zinc-500 text-sm">Encara no hi ha vídeos disponibles.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {videos.map((v) => {
            const videoId = getYouTubeId(v.url_youtube)
            return (
              <div key={v.id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
                {/* Miniatura */}
                {videoId && (
                  <a href={v.url_youtube} target="_blank" rel="noreferrer" className="block relative aspect-video">
                    <img
                      src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                      alt={v.titol}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </a>
                )}
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-bold text-[#1F2937] text-sm">{v.titol}</h3>
                  {v.data_classe && (
                    <p className="text-xs text-zinc-400">
                      📅 {new Date(v.data_classe).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  {v.descripcio && <p className="text-xs text-zinc-500">{v.descripcio}</p>}
                  <a
                    href={v.url_youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors text-center mt-1"
                  >
                    ▶ Veure classe
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
