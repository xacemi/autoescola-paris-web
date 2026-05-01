'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type Horari = {
  id: string
  dia_setmana: string
  hora_inici: string
  hora_fi: string
  tipus?: string
  actiu: boolean
}

export default function AlumnesHorarisPage() {
  const [horaris, setHoraris] = useState<Horari[]>([])
  const [assistencies, setAssistencies] = useState<Set<string>>(new Set())
  const [email, setEmail] = useState<string>('')
  const [pending, setPending] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) return

      setEmail(user.email)

      const [{ data: h }, { data: a }] = await Promise.all([
        supabase.from('horaris').select('*').eq('actiu', true).order('dia_setmana'),
        supabase.from('alumnes_assistencies').select('horari_id').eq('alumne_email', user.email),
      ])

      setHoraris(h ?? [])
      setAssistencies(new Set(a?.map((x) => x.horari_id) ?? []))
      setLoading(false)
    }

    load()
  }, [])

  async function toggleAssistencia(horariId: string) {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    setPending(horariId)
    const assisteix = assistencies.has(horariId)

    if (assisteix) {
      await supabase.from('alumnes_assistencies').delete().eq('horari_id', horariId).eq('alumne_email', email)
      setAssistencies((prev) => { const next = new Set(prev); next.delete(horariId); return next })
    } else {
      await supabase.from('alumnes_assistencies').insert({ horari_id: horariId, alumne_email: email })
      setAssistencies((prev) => new Set([...prev, horariId]))
    }

    setPending(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-800">📅 Horaris de classe</h1>
          <p className="text-sm text-zinc-500 mt-1">Carregant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-800">📅 Horaris de classe</h1>
        <p className="text-sm text-zinc-500 mt-1">Confirma la teva assistència a cada classe</p>
      </div>

      {!horaris.length ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-zinc-100">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-zinc-500 text-sm">Encara no hi ha horaris disponibles.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {horaris.map((h) => {
            const assisteix = assistencies.has(h.id)
            const isPending = pending === h.id
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
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => toggleAssistencia(h.id)}
                  className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50 ${
                    assisteix
                      ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                  }`}
                >
                  {isPending ? '...' : assisteix ? '✗ Eliminar assistència' : '✓ Asistiré a la clase'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
