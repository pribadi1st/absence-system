// components/Staff.tsx
'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import TimeDisplay from './ClockInOut/Time';
import QRCodeButton from './ClockInOut/QRCode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employees } from '@/types/employee';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function StaffClockInOut({ employees }: { employees: Employees }) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const queryClient = useQueryClient()

  const { data: empAttendance, error: empAttendanceError } = useQuery({
    queryKey: ['empAttendance', selectedEmployee],
    queryFn: async () => {
      const res = await fetch(`/api/attendances/employee/${selectedEmployee}`);
      return res.json();
    },
    enabled: !!selectedEmployee,
  });

  const { mutate: clockIn } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/attendances/employee/${selectedEmployee}/in`, {
        method: 'POST',
      });
      return res.json();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['empAttendance', selectedEmployee] })
    }
  });

  const { mutateAsync: clockOut } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/attendances/employee/${selectedEmployee}/out`, {
        method: 'POST',
      });
      return res.json();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['empAttendance', selectedEmployee] })
    }
  });

  const handleClockIn = async () => {
    if (!selectedEmployee) return;
    await clockIn()
  };

  const handleClockOut = async () => {
    if (!selectedEmployee) return;
    await clockOut()
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  const checkEmployee = (id: string) => {
    setSelectedEmployee(id);
  };

  const canClockIn = useMemo(() => {
    if (!empAttendance) return true;
    if (empAttendance.attendance.length == 0) return true;
    return false
    // Clockedin
  }, [empAttendance]);

  const canClockOut = useMemo(() => {
    if (!empAttendance) return true;
    if (!empAttendance.attendance[0].clock_out) return true;
    return false
    // Clockedin
  }, [empAttendance]);



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <TimeDisplay />

        {/* Employee Selection */}
        <div className="mb-6">
          {employees.length > 0 &&
            <Select onValueChange={checkEmployee} value={selectedEmployee}>
              <SelectTrigger className="w-full h-12 bg-white">
                <SelectValue placeholder="Pilih Karyawan" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()} className="hover:bg-gray-100">
                    <div className="flex flex-col">
                      <span className="font-medium">{employee.first_name + ' ' + employee.last_name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        </div>

        {!!empAttendance &&
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                onClick={handleClockIn}
                className={`h-16 text-lg ${canClockIn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300'}`}
                disabled={!canClockIn || !selectedEmployee}
              >
                Clock In
              </Button>
              <Button
                onClick={handleClockOut}
                className={`h-16 text-lg ${canClockOut ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300'}`}
                disabled={!canClockOut || !selectedEmployee}
              >
                Clock Out
              </Button>
            </div>

            {/* Detailed Attendance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Riwayat Absensi</h3>
              {empAttendance?.attendance?.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <div className="flex space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="w-20">Masuk:</span>
                            <span className="font-medium">
                              {empAttendance.attendance[0].clock_in}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-20">Pulang:</span>
                            <span className="font-medium">
                              {empAttendance.attendance.length > 0 && empAttendance.attendance[0].clock_out ? empAttendance.attendance[0].clock_out : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${empAttendance.attendance.length > 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {empAttendance.attendance.length > 0 && empAttendance.attendance[0].clock_out ? 'Selesai' : 'Sedang Bekerja'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Belum ada riwayat absensi</p>
                </div>
              )}
            </div>
          </>
        }



        {/* <QRCodeButton
          onShowQRCode={toggleQRCode}
          isShowing={showQRCode}
        /> */}

        {showQRCode && (
          <div className="mt-6 p-4 border rounded-lg bg-white">
            {/* <QRCodeDisplay /> */}
          </div>
        )}
      </div>
    </div>
  );
}