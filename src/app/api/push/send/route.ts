import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import webpush from 'web-push'

webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient()
    const { title, body, seu, url } = await req.json()

    let query = supabase.from('push_subscriptions').select('subscription')
    if (seu && seu !== 'Todas') {
        query = query.eq('seu', seu)
    }

    const { data: subscriptions, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const payload = JSON.stringify({ title, body, url: url || '/alumnes' })

    const results = await Promise.allSettled(
        subscriptions.map((s) => webpush.sendNotification(s.subscription, payload))
    )

    const enviades = results.filter((r) => r.status === 'fulfilled').length
    const fallides = results.filter((r) => r.status === 'rejected').length

    return NextResponse.json({ enviades, fallides })
}
const { data: subscriptions, error } = await query
console.log('Subscripcions trobades:', subscriptions?.length, error)

const results = await Promise.allSettled(
    subscriptions.map((s) => webpush.sendNotification(s.subscription, payload))
)

results.forEach((r, i) => {
    if (r.status === 'rejected') console.log('Error enviant:', r.reason)
})