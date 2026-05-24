import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function createSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

// Llistar programats
export async function GET() {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
        .from('push_programats')
        .select('*')
        .order('enviar_a', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// Crear programat
export async function POST(req: Request) {
    const supabase = createSupabaseAdmin()
    const { title, body, seu, enviar_a } = await req.json()

    const { error } = await supabase.from('push_programats').insert({
        title, body, seu, enviar_a
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}

// Esborrar programat
export async function DELETE(req: Request) {
    const supabase = createSupabaseAdmin()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

    const { error } = await supabase.from('push_programats').delete().eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}