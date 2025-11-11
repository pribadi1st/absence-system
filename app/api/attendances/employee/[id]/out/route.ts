import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/attendances/employee/[id]/out'>) {
    const { id } = await ctx.params
    const supabase = await createClient()
    const date = new Date()
    const clockOutDate = date.toISOString().split('T')[0]
    const clockOutTime = date.toTimeString().split(' ')[0]
    const { status, error } = await supabase.from('attendance_records').update({
        clock_out: clockOutTime,
    }).eq('employee_id', id).eq('attendance_date', clockOutDate)

    if (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
    return NextResponse.json({ status })
}