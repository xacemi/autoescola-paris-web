import { crearVideo } from '../actions'

export default function NouVideoPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Nou vídeo</h1>

      <form action={crearVideo} className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Títol *</label>
          <input name="titol" required placeholder="Classe del dilluns 5 de maig"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">URL de YouTube (no listat) *</label>
          <input name="url_youtube" required type="url" placeholder="https://www.youtube.com/watch?v=..."
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-xs text-zinc-400 mt-1">Puja el vídeo a YouTube com a &quot;No listat&quot; i copia l&apos;enllaç aquí.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Descripció</label>
          <textarea name="descripcio" rows={3} placeholder="Contingut de la classe..."
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Data de la classe</label>
          <input name="data_classe" type="date"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex items-center gap-2">
          <input name="actiu" type="checkbox" id="actiu" defaultChecked className="w-4 h-4 accent-blue-600" />
          <label htmlFor="actiu" className="text-sm text-zinc-700">Visible per als alumnes</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
            Guardar vídeo
          </button>
          <a href="/admin/videos" className="text-sm text-zinc-500 hover:text-zinc-700 py-2">Cancel·lar</a>
        </div>
      </form>
    </div>
  )
}
