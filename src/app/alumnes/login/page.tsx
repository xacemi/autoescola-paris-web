'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { loginAlumne, registreAlumne } from './actions'

export default function AlumnesLoginPage() {
  const [mode, setMode] = useState<'login' | 'registre'>('login')
  const [loginState, loginAction, loginPending] = useActionState(loginAlumne, undefined)
  const [registreState, registreAction, registrePending] = useActionState(registreAlumne, undefined)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordError = confirmPassword && password !== confirmPassword ? 'Las contraseñas no coinciden' : ''

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.png" alt="Autoescola Paris" width={64} height={64} className="rounded-full mb-3" />
          <h1 className="text-xl font-bold text-zinc-800">Zona Alumnos</h1>
          <p className="text-xs text-zinc-500">Autoescola Paris</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-zinc-100 p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === 'login' ? 'bg-white text-[#0110D6] shadow-sm' : 'text-zinc-500'}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setMode('registre')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === 'registre' ? 'bg-white text-[#0110D6] shadow-sm' : 'text-zinc-500'}`}
          >
            Registrarme
          </button>
        </div>

        {/* Login */}
        {mode === 'login' && (
          <form action={loginAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email</label>
              <input name="email" type="email" required placeholder="tu@email.com"
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Contraseña</label>
              <input name="password" type="password" required placeholder="••••••••"
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6]" />
            </div>
            {loginState?.error && <p className="text-sm text-red-600">{loginState.error}</p>}
            <button type="submit" disabled={loginPending}
              className="bg-[#0110D6] text-white font-semibold py-2.5 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50">
              {loginPending ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}

        {/* Registre */}
        {mode === 'registre' && (
          <form action={registreAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Nombre completo *</label>
              <input name="nom" required placeholder="Juan García López"
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email *</label>
              <input name="email" type="email" required placeholder="tu@email.com"
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">DNI *</label>
              <input name="dni" required placeholder="12345678A"
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Sede *</label>
              <select name="seu" required
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6] text-zinc-700">
                <option value="">Selecciona tu sede</option>
                <option value="Lleida">Autoescola Lleida</option>
                <option value="Mollerussa">Autoescola Mollerussa</option>
                <option value="Online">On Line</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Contraseña *</label>
              <input name="password" type="password" required placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Confirma la contraseña *</label>
              <input type="password" required placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6] ${passwordError ? 'border-red-400' : 'border-zinc-200'}`} />
              {passwordError && <p className="text-xs text-red-600 mt-1">{passwordError}</p>}
            </div>
            {registreState?.error && <p className="text-sm text-red-600">{registreState.error}</p>}
            <button
              type="submit"
              disabled={registrePending || !!passwordError || !password || !confirmPassword}
              className="bg-[#0110D6] text-white font-semibold py-2.5 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50">
              {registrePending ? 'Registrando...' : 'Registrarme'}
            </button>
            <p className="text-xs text-zinc-400 text-center">
              Tu cuenta quedará pendiente de aprobación por la autoescuela.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
