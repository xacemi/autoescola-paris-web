'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type InfoItem = {
  id: string
  titol: string
  contingut: string
  ordre: number
}

export default function AlumnesInformacioPage() {
  const [items, setItems] = useState<InfoItem[]>([])
  const [obert, setObert] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase
      .from('alumnes_informacio')
      .select('*')
      .eq('actiu', true)
      .order('ordre', { ascending: true })
      .then(({ data }) => {
        setItems(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-bold text-zinc-800">📋 Informació</h1>
        <p className="text-sm text-zinc-500 mt-1">Carregant...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-800">📋 Informació important.</h1>
        <p className="text-sm text-zinc-500 mt-1">Toca cada apartat per llegir la informació</p>
      </div>

      {!items.length ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-zinc-100">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-zinc-500 text-sm">Encara no hi ha informació disponible.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const isObert = obert === item.id
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setObert(isObert ? null : item.id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-zinc-50 transition-colors"
                >
                  <span className="font-bold text-[#1F2937] text-sm">{item.titol}</span>
                  <svg
                    className={`w-5 h-5 text-[#0110D6] flex-shrink-0 transition-transform duration-200 ${isObert ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isObert && (
                  <div className="px-5 pb-5 border-t border-zinc-100">
                    <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap pt-4">{item.contingut}</p>
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
