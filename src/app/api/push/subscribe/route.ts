import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { subscription, seu } = await req.json()

    // Eliminar subscripció anterior si existeix
    await supabase.from('push_subscriptions').delete().eq('alumne_email', user.email)

    // Guardar nova subscripció
    const { error } = await supabase.from('push_subscriptions').insert({
        alumne_email: user.email,
        seu,
        subscription,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
}