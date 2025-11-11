import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/attendances/employee/[id]/in'>) {
    const { id } = await ctx.params
    const supabase = await createClient()
    const today = new Date()
    // Format date (YYYY-MM-DD)
    const clockInDate = today.toISOString().split('T')[0];
    const clockInTime = today.toTimeString().split(' ')[0];
    const { status, error } = await supabase.from('attendance_records').insert({
        employee_id: id,
        attendance_date: clockInDate,
        clock_in: clockInTime,
    })

    if (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
    return NextResponse.json({ status })
}