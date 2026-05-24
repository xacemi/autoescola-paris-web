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

export async function GET(req: Request) {
    // Protecció: només Vercel pot cridar aquest endpoint
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'No autoritzat' }, { status: 401 })
    }

    const supabase = createSupabaseAdmin()

    // Obtenir missatges pendents amb hora d'enviament passada
    const { data: pendents, error } = await supabase
        .from('push_programats')
        .select('*')
        .eq('enviat', false)
        .lte('enviar_a', new Date().toISOString())

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!pendents || pendents.length === 0) return NextResponse.json({ ok: true, enviats: 0 })

    for (const missatge of pendents) {
        // Obtenir subscripcions
        let query = supabase.from('push_subscriptions').select('id, subscription')
        if (missatge.seu !== 'Todas') {
            query = query.eq('seu', missatge.seu)
        }
        const { data: subscriptions } = await query

        if (!subscriptions || subscriptions.length === 0) {
            await supabase.from('push_programats')
                .update({ enviat: true, enviat_a: new Date().toISOString(), enviades: 0, fallides: 0 })
                .eq('id', missatge.id)
            continue
        }

        const payload = JSON.stringify({
            title: missatge.title,
            body: missatge.body,
            url: missatge.url || '/alumnes'
        })

        let enviades = 0
        let fallides = 0

        await Promise.all(
            subscriptions.map(async (s) => {
                try {
                    await webpush.sendNotification(s.subscription, payload)
                    enviades++
                } catch (err: any) {
                    fallides++
                    if (err?.statusCode === 410 || err?.statusCode === 404) {
                        await supabase.from('push_subscriptions').delete().eq('id', s.id)
                    }
                }
            })
        )

        // Marcar com a enviat i guardar log
        await supabase.from('push_programats')
            .update({ enviat: true, enviat_a: new Date().toISOString(), enviades, fallides })
            .eq('id', missatge.id)

        await supabase.from('push_logs').insert({
            title: missatge.title,
            body: missatge.body,
            seu: missatge.seu,
            enviades,
            fallides,
        })
    }

    return NextResponse.json({ ok: true, enviats: pendents.length })
}