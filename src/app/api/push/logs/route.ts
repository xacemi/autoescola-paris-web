import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function createSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

export async function GET() {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
        .from('push_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}