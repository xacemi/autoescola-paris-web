'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  const passwordError = confirm && password !== confirm ? 'Las contraseñas no coinciden' : ''

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleReset() {
    if (!password || passwordError) return
    setStatus('loading')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('No se ha podido actualizar la contraseña. El enlace puede haber caducado.')
      setStatus('error')
    } else {
      setStatus('done')
      setTimeout(() => router.push('/alumnes/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.png" alt="Autoescola Paris" width={64} height={64} className="rounded-full mb-3" />
          <h1 className="text-xl font-bold text-zinc-800">Nueva contraseña</h1>
          <p className="text-xs text-zinc-500">Autoescola Paris</p>
        </div>

        {status === 'done' ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 text-center">
            ✅ Contraseña actualizada correctamente. Redirigiendo...
          </div>
        ) : !ready ? (
          <div className="text-center text-sm text-zinc-500 py-4">
            Verificando enlace...
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Confirma la contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6] ${passwordError ? 'border-red-400' : 'border-zinc-200'}`}
              />
              {passwordError && <p className="text-xs text-red-600 mt-1">{passwordError}</p>}
            </div>
            {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleReset}
              disabled={status === 'loading' || !password || !confirm || !!passwordError}
              className="bg-[#0110D6] text-white font-semibold py-2.5 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
