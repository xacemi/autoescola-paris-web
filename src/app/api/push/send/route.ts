import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import webpush from 'web-push'

webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

function createSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

export async function POST(req: Request) {
    const supabase = createSupabaseAdmin()
    const { title, body, seu, url } = await req.json()

    let query = supabase.from('push_subscriptions').select('subscription')
    if (seu && seu !== 'Todas') {
        query = query.eq('seu', seu)
    }

    const { data: subscriptions, error } = await query
    console.log('Subscripcions trobades:', subscriptions?.length, error)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const payload = JSON.stringify({ title, body, url: url || '/alumnes' })

    const results = await Promise.allSettled(
        subscriptions.map((s) => webpush.sendNotification(s.subscription, payload))
    )

    results.forEach((r) => {
        if (r.status === 'rejected') console.log('Error enviant:', r.reason)
    })

    const enviades = results.filter((r) => r.status === 'fulfilled').length
    const fallides = results.filter((r) => r.status === 'rejected').length

    // Guardar log
    await supabase.from('push_logs').insert({
        title,
        body,
        seu: seu || 'Todas',
        enviades,
        fallides,
    })

    return NextResponse.json({ enviades, fallides })
}