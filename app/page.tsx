'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, ClipboardList } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR to avoid hydration issues
const StaffClockInOut = dynamic(() => import('@/components/Staff'), { ssr: false });
const AdminDashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-3">Sistem Absensi Karyawan</h1>
          <p className="text-lg text-gray-600">Kelola kehadiran karyawan dengan mudah</p>
        </div>

        <Tabs defaultValue="staff" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Clock className="size-4" />
              Absensi Staff
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <ClipboardList className="size-4" />
              Dashboard Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="mt-6">
            <StaffClockInOut />
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}