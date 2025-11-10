// components/Staff.tsx
'use client';

import { useState } from 'react';
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

export default function StaffClockInOut({ employees }: { employees: Employees }) {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const handleClockIn = () => {
    if (!selectedEmployee) return;
    console.log('Clocked in at:', new Date(), 'Employee:', selectedEmployee);
    setIsClockedIn(true);
  };

  const handleClockOut = () => {
    if (!selectedEmployee) return;
    console.log('Clocked out at:', new Date(), 'Employee:', selectedEmployee);
    setIsClockedIn(false);
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <TimeDisplay />

        {/* Employee Selection */}
        <div className="mb-6">
          {employees.length > 0 &&
            <Select onValueChange={setSelectedEmployee} value={selectedEmployee}>
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

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            onClick={handleClockIn}
            className={`h-16 text-lg ${!isClockedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300'}`}
            disabled={isClockedIn || !selectedEmployee}
          >
            Clock In
          </Button>
          <Button
            onClick={handleClockOut}
            className={`h-16 text-lg ${isClockedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300'}`}
            disabled={!isClockedIn || !selectedEmployee}
          >
            Clock Out
          </Button>
        </div>

        <QRCodeButton
          onShowQRCode={toggleQRCode}
          isShowing={showQRCode}
        />

        {showQRCode && (
          <div className="mt-6 p-4 border rounded-lg bg-white">
            {/* <QRCodeDisplay /> */}
          </div>
        )}
      </div>
    </div>
  );
}