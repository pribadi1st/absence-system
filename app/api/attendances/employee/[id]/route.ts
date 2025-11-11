import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/attendances/employee/[id]'>) {
    const { id } = await ctx.params
    const todayDate = new Date().toISOString().split('T')[0]
    const supabase = await createClient()
    const { data: attendance } = await supabase.from('attendance_records').select('*').eq('employee_id', id).eq('attendance_date', todayDate)
    return NextResponse.json({ attendance })
}