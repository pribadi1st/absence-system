'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useEffect, useState } from 'react';

export default function TimeDisplay() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-center mb-6">
            <div className="text-5xl font-mono text-gray-800 font-bold">
                {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="text-md text-gray-500 mt-2">
                {format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}
            </div>
        </div>
    );
}