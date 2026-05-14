'use client'

import { useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function PushSubscriber({ seu }: { seu: string }) {
    useEffect(() => {
        async function subscribeIfNeeded() {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

            const permission = await Notification.requestPermission()
            if (permission !== 'granted') return

            const registration = await navigator.serviceWorker.ready

            // Comprovar si ja té subscripció
            const existing = await registration.pushManager.getSubscription()
            if (existing) return

            // Crear nova subscripció
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            })

            // Guardar a Supabase
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription, seu }),
            })
        }

        subscribeIfNeeded()
    }, [seu])

    return null
}