'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StaffAttendance } from '@/types/attendances';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [staffsData, setStaffsData] = useState<StaffAttendance[]>([]);
  useEffect(() => {
    const fetchStaffsData = async () => {
      const response = await fetch('/api/attendances');
      const data = await response.json();
      setStaffsData(data.data);
    };
    fetchStaffsData();
  }, [])

  const todayPresent = staffsData.filter((staff) => staff.status === 'present').length;
  const todayAbsent = staffsData.filter((staff) => staff.status === 'absent').length;
  const todayLate = staffsData.filter((staff) => staff.status === 'late').length;
  const todayClockOut = staffsData.filter((staff) => staff.status === 'clock-out').length;

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'time-off':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari nama atau ID..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Semua Departemen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Departemen</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Creative">Creative</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="present">Hadir</SelectItem>
            <SelectItem value="absent">Tidak Hadir</SelectItem>
            <SelectItem value="late">Terlambat</SelectItem>
            <SelectItem value="time-off">Cuti/Izin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Hari Ini" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hari Ini</SelectItem>
            <SelectItem value="yesterday">Kemarin</SelectItem>
            <SelectItem value="week">Minggu Ini</SelectItem>
            <SelectItem value="month">Bulan Ini</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">👥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffsData.length}</div>
            {/* <p className="text-xs text-muted-foreground">+2 dari bulan lalu</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir Hari Ini</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">✓</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPresent}</div>
            {/* <p className="text-xs text-muted-foreground">+3 dari kemarin</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">⏰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLate}</div>
            {/* <p className="text-xs text-muted-foreground">-1 dari kemarin</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">✗</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAbsent}</div>
            {/* <p className="text-xs text-muted-foreground">+1 dari kemarin</p> */}
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Kehadiran</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Karyawan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Total Jam</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffsData.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClass(staff.status)}`}>
                      {staff.status}
                    </span>
                  </TableCell>
                  <TableCell>{staff.checkIn}</TableCell>
                  <TableCell>{staff.checkOut}</TableCell>
                  <TableCell>{staff.totalJam}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
