import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
    const supabase = await createClient()
    const { data: employees } = await supabase.from('employees').select('*')
    return NextResponse.json({ employees })
}

export async function POST(req: NextRequest) {

    const data: { firstName: string, lastName: string } = await req.json()
    const supabase = await createClient()
    const { data: employee, status, error } = await supabase.from('employees').insert({
        first_name: data.firstName,
        last_name: data.lastName,
    })

    return NextResponse.json({ employee, status })
}