'use client'

import { useEffect, useState } from 'react'

const BANNER_KEY = 'push_banner_dismissed_at'
const UNA_SETMANA_MS = 7 * 24 * 60 * 60 * 1000

export default function PushSubscriber({ seu }: { seu: string }) {
  const [mounted, setMounted] = useState(false)
  const [mostrarBanner, setMostrarBanner] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function checkPermission() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

      const permission = Notification.permission

      if (permission === 'granted') {
        await subscriure()
      } else if (permission === 'default') {
        // Comprovar si fa menys d'una setmana que es va tancar
        const dismissedAt = localStorage.getItem(BANNER_KEY)
        if (dismissedAt) {
          const elapsed = Date.now() - parseInt(dismissedAt)
          if (elapsed < UNA_SETMANA_MS) return // No mostrar fins d'aquí una setmana
        }
        setMostrarBanner(true)
      }
    }

    checkPermission()
  }, [mounted, seu])

  async function subscriure() {
    const registration = await navigator.serviceWorker.ready
    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })
    }
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription, seu }),
    })
  }

  async function handleActivar() {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      await subscriure()
    }
    localStorage.removeItem(BANNER_KEY)
    setMostrarBanner(false)
  }

  function handleTancar() {
    localStorage.setItem(BANNER_KEY, Date.now().toString())
    setMostrarBanner(false)
  }

  if (!mostrarBanner) return null

  return (
    <div className="bg-[#0110D6] border-b border-blue-700">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">🔔</span>
        <div className="flex-1">
          <p className="text-white text-xs font-semibold leading-snug">
            Activa las notificaciones para recibir avisos de horarios de clase, fechas de examen y comunicados importantes.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleActivar}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Activar
          </button>
          <button
            onClick={handleTancar}
            className="text-blue-200 hover:text-white text-xs px-2 py-1.5 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}