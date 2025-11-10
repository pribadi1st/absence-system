export interface StaffAttendance {
    id: number;
    name: string;
    status: string;
    checkIn: string | null;
    checkOut: string | null;
    totalJam: number;
}