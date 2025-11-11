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
            // Example values:
            // clock_in: "23:03:00"
            // clock_out: "23:13:42"

            // Create Date objects for both times (using the same date since they're on the same day)
            const dateStr = record.attendance_date; // "2025-11-11"
            const start = new Date(`${dateStr}T${record.clock_in}`);
            const end = new Date(`${dateStr}T${record.clock_out}`);

            // Calculate difference in milliseconds
            const diffTime = Math.abs(end.getTime() - start.getTime());

            // Convert to hours, minutes, seconds
            const hours = Math.floor(diffTime / (1000 * 60 * 60));
            const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

            // For your example (23:03:00 to 23:13:42):
            // hours = 0
            // minutes = 10
            // seconds = 42
            // total minutes = 10.7 minutes (10 + 42/60)

            // If you want total hours as a decimal (e.g., 0.1783 hours for 10.7 minutes)
            const totalHours = diffTime / (1000 * 60 * 60); // ~0.1783 for 10:42

            // Or if you want a formatted string
            const formattedDuration = `${hours}h ${minutes}m ${seconds}s`; // "0h 10m 42s"
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
