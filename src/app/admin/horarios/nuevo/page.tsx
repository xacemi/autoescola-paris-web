import { createHorario } from '../actions'

export default function NuevoHorarioPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Nuevo horario</h1>
      <form action={createHorario} className="flex flex-col gap-4 max-w-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Día de la semana</label>
            <input name="dia_setmana" required placeholder="Ej: Lunes"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Tipo</label>
            <input name="tipus" placeholder="Ej: Teórica / Práctica"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Hora inicio</label>
            <input name="hora_inici" type="time" required
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Hora fin</label>
            <input name="hora_fi" type="time" required
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Profesor</label>
            <input name="professor"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Link online</label>
            <input name="link_online" placeholder="https://..."
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="actiu" defaultChecked
            className="w-4 h-4 rounded border-zinc-300 text-blue-600" />
          <span className="text-sm text-zinc-700">Activo</span>
        </label>

        <div className="flex gap-3">
          <button type="submit"
            className="bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Guardar
          </button>
          <a href="/admin/horarios" className="text-sm text-zinc-500 hover:underline self-center">Cancelar</a>
        </div>
      </form>
    </div>
  )
}
