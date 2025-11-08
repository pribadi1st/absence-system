// components/ClockInOut/ClockOut.tsx
'use client';

import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ClockOutProps {
    currentTime: Date;
    onClockOut: () => void;
}

export default function ClockOut({ currentTime, onClockOut }: ClockOutProps) {
    return (
        <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-white shadow-sm">
            <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Clock Out</h3>
                <div className="text-4xl font-mono text-gray-800">
                    {format(currentTime, 'HH:mm')}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                    {format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}
                </div>
            </div>
            <Button
                onClick={onClockOut}
                className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg"
            >
                Clock Out
            </Button>
        </div>
    );
}