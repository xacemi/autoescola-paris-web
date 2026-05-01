import { crearInformacio } from '../actions'

export default function NovaInformacioPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Nova entrada d&apos;informació</h1>

      <form action={crearInformacio} className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Títol *</label>
          <input name="titol" required placeholder="Ex: Documentació per a l'examen"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Contingut *</label>
          <textarea name="contingut" required rows={6} placeholder="Escriu aquí la informació important..."
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Ordre (número)</label>
          <input name="ordre" type="number" defaultValue={0} min={0}
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-xs text-zinc-400 mt-1">Els números més petits surten primers.</p>
        </div>

        <div className="flex items-center gap-2">
          <input name="actiu" type="checkbox" id="actiu" defaultChecked className="w-4 h-4 accent-blue-600" />
          <label htmlFor="actiu" className="text-sm text-zinc-700">Visible per als alumnes</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
            Guardar
          </button>
          <a href="/admin/informacio" className="text-sm text-zinc-500 hover:text-zinc-700 py-2">Cancel·lar</a>
        </div>
      </form>
    </div>
  )
}
