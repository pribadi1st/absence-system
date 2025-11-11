import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
    const supabase = await createClient();

    const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD

    // Ambil semua karyawan
    const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .order('last_name', { ascending: true });

    if (empError) {
        console.error(empError);
        return NextResponse.json({ success: false, message: empError.message }, { status: 500 });
    }

    // Ambil record kehadiran hari ini
    const { data: attendance, error: attError } = await supabase
        .from('attendance_records')
        .select('employee_id, attendance_date, clock_in, clock_out')
        .eq('attendance_date', today);

    if (attError) {
        console.error(attError);
        return NextResponse.json({ success: false, message: attError.message }, { status: 500 });
    }

    // Kalau tidak ada satupun record hari ini → semua dianggap belum hadir
    if (!attendance || attendance.length === 0) {
        const allAbsent = employees.map((emp) => ({
            id: emp.id,
            name: `${emp.first_name} ${emp.last_name}`,
            status: 'Belum Hadir',
            checkIn: null,
            checkOut: null,
            totalJam: 0,
        }));

        return NextResponse.json({ success: true, data: allAbsent });
    }

    // Gabungkan data karyawan + absensi
    const result = employees.map((emp) => {
        const record = attendance.find((a) => a.employee_id === emp.id);

        let status = 'absent';
        if (record?.clock_in && !record?.clock_out) status = 'present';
        else if (record?.clock_in && record?.clock_out) status = 'clock-out';
        let totalHour = 0
        if (record?.clock_in && record?.clock_out) {
            const diffTime = Math.abs(record.clock_out.getTime() - record.clock_in.getTime());
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            totalHour = diffHours;
        }

        return {
            id: emp.id,
            name: `${emp.first_name} ${emp.last_name}`,
            status,
            checkIn: record?.clock_in || null,
            checkOut: record?.clock_out || null,
            totalJam: totalHour,
        };
    });

    return NextResponse.json({ success: true, data: result });
}
