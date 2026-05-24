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

    let query = supabase.from('push_subscriptions').select('id, subscription')
    if (seu && seu !== 'Todas') {
        query = query.eq('seu', seu)
    }

    const { data: subscriptions, error } = await query
    console.log('Subscripcions trobades:', subscriptions?.length, error)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const payload = JSON.stringify({ title, body, url: url || '/alumnes' })

    const results = await Promise.allSettled(
        subscriptions.map((s) =>
            webpush.sendNotification(s.subscription, payload).then(() => ({ id: s.id, ok: true }))
        )
    )

    // Esborrar subscripcions invàlides (410 Gone o 404 Not Found)
    const idsAEsborrar: string[] = []
    results.forEach((r) => {
        if (r.status === 'rejected') {
            const reason = r.reason as any
            console.log('Error enviant:', reason?.statusCode, reason?.message)
            if (reason?.statusCode === 410 || reason?.statusCode === 404) {
                // Subscripció caducada o revocada — cal esborrar-la
                // Necessitem l'id, obtenim-lo per índex
            }
        }
    })

    // Millor aproximació: processar cada subscripció individualment
    let enviades = 0
    let fallides = 0

    await Promise.all(
        subscriptions.map(async (s) => {
            try {
                await webpush.sendNotification(s.subscription, payload)
                enviades++
            } catch (err: any) {
                fallides++
                console.log('Error enviant a', s.id, ':', err?.statusCode, err?.message)
                // Si la subscripció ha caducat o ha estat revocada, esborrar-la
                if (err?.statusCode === 410 || err?.statusCode === 404) {
                    console.log('Esborrant subscripció invàlida:', s.id)
                    await supabase.from('push_subscriptions').delete().eq('id', s.id)
                }
            }
        })
    )

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