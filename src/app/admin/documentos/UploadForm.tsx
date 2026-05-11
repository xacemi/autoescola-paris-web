'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
    { value: 0, label: 'Conceptos y definiciones' },
    { value: 1, label: 'Normas y señales' },
    { value: 2, label: 'Seguridad vial' },
    { value: 3, label: 'Conocimiento del vehículo' },
]

export default function UploadForm() {
    const router = useRouter()
    const [titol, setTitol] = useState('')
    const [categoria, setCategoria] = useState(0)
    const [posicio, setPosicio] = useState(0)
    const [fitxer, setFitxer] = useState<File | null>(null)
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [error, setError] = useState('')

    async function handleSubmit() {
        if (!titol || !fitxer) return
        setStatus('loading')

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Pujar fitxer a Storage
        const ext = fitxer.name.split('.').pop()
        const path = `${Date.now()}-${titol.replace(/\s+/g, '-')}.${ext}`
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(path, fitxer, { upsert: false })

        if (uploadError) {
            setError('Error al subir el archivo: ' + uploadError.message)
            setStatus('error')
            return
        }

        // Obtenir URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(path)

        // Guardar a la taula
        const { error: dbError } = await supabase.from('alumnes_documents').insert({
            titol,
            categoria,
            url_nextcloud: publicUrl,
            posicio,
            actiu: true,
        })

        if (dbError) {
            setError('Error al guardar: ' + dbError.message)
            setStatus('error')
            return
        }

        setStatus('done')
        setTitol('')
        setFitxer(null)
        setPosicio(0)
        router.refresh()
    }

    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm mb-8">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Añadir documento</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Título *</label>
                    <input value={titol} onChange={(e) => setTitol(e.target.value)} placeholder="Resumen tema 1"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Posición</label>
                    <input type="number" value={posicio} onChange={(e) => setPosicio(Number(e.target.value))} placeholder="1"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Archivo PDF o imagen *</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={(e) => setFitxer(e.target.files?.[0] ?? null)}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Categoría *</label>
                    <select value={categoria} onChange={(e) => setCategoria(Number(e.target.value))}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-700">
                        {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>
                <div className="sm:col-span-3">
                    {status === 'error' && <p className="text-sm text-red-600 mb-2">{error}</p>}
                    {status === 'done' && <p className="text-sm text-green-600 mb-2">✅ Documento añadido correctamente</p>}
                    <button onClick={handleSubmit} disabled={status === 'loading' || !titol || !fitxer}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
                        {status === 'loading' ? 'Subiendo...' : '+ Añadir documento'}
                    </button>
                </div>
            </div>
        </div>
    )
}