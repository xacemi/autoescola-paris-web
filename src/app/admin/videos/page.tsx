import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { eliminarVideo } from './actions'
import DeleteVideoButton from './DeleteVideoButton'

export const dynamic = 'force-dynamic'

export default async function VideosAdminPage() {
  const supabase = await createSupabaseServerClient()
  const { data: videos } = await supabase
    .from('alumnes_videos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Vídeos alumnes</h1>
        <Link
          href="/admin/videos/nou"
          className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          + Nou vídeo
        </Link>
      </div>

      {!videos?.length ? (
        <p className="text-zinc-500 text-sm">No hi ha vídeos encara.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {videos.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-zinc-200 px-5 py-4 flex items-center justify-between shadow-sm gap-4">
              <div className="flex-1">
                <p className="font-medium text-zinc-800">{v.titol}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {v.data_classe ? new Date(v.data_classe).toLocaleDateString('es-ES') : 'Sense data'}
                  {' · '}
                  <span className={v.actiu ? 'text-green-600' : 'text-zinc-400'}>
                    {v.actiu ? 'Visible' : 'Ocult'}
                  </span>
                </p>
                <a href={v.url_youtube} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline truncate block max-w-xs">
                  {v.url_youtube}
                </a>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <DeleteVideoButton action={eliminarVideo.bind(null, v.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
