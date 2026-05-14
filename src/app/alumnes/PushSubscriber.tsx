'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

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

            const existing = await registration.pushManager.getSubscription()
            if (existing) return

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            })

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