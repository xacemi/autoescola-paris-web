'use client'

import { useEffect, useState } from 'react'

export default function PushSubscriber({ seu }: { seu: string }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        async function subscribeIfNeeded() {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

            const permission = await Notification.requestPermission()
            if (permission !== 'granted') return

            const registration = await navigator.serviceWorker.ready

            // Obtenir subscripció existent o crear-ne una de nova
            let subscription = await registration.pushManager.getSubscription()

            if (!subscription) {
                // No hi ha subscripció, crear-ne una
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                })
            }

            // SEMPRE enviar la subscripció actual a Supabase
            // L'API farà un upsert per actualitzar si ja existia
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription, seu }),
            })
        }

        subscribeIfNeeded()
    }, [mounted, seu])

    return null
}