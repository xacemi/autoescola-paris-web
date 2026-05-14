'use client'

import { useState } from 'react'

const SEDES = ['Todas', 'Lleida', 'Mollerussa', 'Online']

export default function NotificacionesPage() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [seu, setSeu] = useState('Todas')
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [result, setResult] = useState('')

    async function handleSend() {
        if (!title || !body) return
        setStatus('loading')

        const res = await fetch('/api/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, seu }),
        })

        const data = await res.json()

        if (!res.ok) {
            setResult('Error al enviar')
            setStatus('error')
        } else {
            setResult(`✅ Enviadas: ${data.enviades} · ❌ Fallidas: ${data.fallides}`)
            setStatus('done')
            setTitle('')
            setBody('')
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-zinc-800 mb-6">Enviar notificación</h1>

            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm max-w-lg">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Título *</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nuevo aviso de la autoescuela"
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Mensaje *</label>
                        <textarea value={body} onChange={(e) => setBody(e.target.value)}
                            placeholder="Escribe el mensaje aquí..."
                            rows={4}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Destinatarios</label>
                        <select value={seu} onChange={(e) => setSeu(e.target.value)}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-700">
                            {SEDES.map((s) => (
                                <option key={s} value={s}>{s === 'Todas' ? '🌐 Todos los alumnos' : `📍 ${s}`}</option>
                            ))}
                        </select>
                    </div>
                    {result && (
                        <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {result}
                        </p>
                    )}
                    <button onClick={handleSend}
                        disabled={status === 'loading' || !title || !body}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50">
                        {status === 'loading' ? 'Enviando...' : '🔔 Enviar notificación'}
                    </button>
                </div>
            </div>
        </div>
    )
}