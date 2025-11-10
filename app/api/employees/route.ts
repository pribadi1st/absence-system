import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
    const supabase = await createClient()
    const { data: employees } = await supabase.from('employees').select('*')
    return NextResponse.json({ employees })
}