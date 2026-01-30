"use client";

import { AttendanceDialog } from "@/app/manage/employees/attendance-dialog";
import { EmployeeDialog } from "@/app/manage/employees/employee-dialog";
import { SalaryDialog } from "@/app/manage/employees/salary-dialog";
import { WorkDialog } from "@/app/manage/employees/work-dialog";
import { useEmployeeManagement } from "@/app/manage/employees/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit,
  Mail,
  Plus,
  Search,
  Trash2,
  Users,
  DollarSign,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { useState } from "react";

export default function EmployeesPage() {
  const {
    employees,
    attendanceRecords,
    salaryRecords,
    workRecords,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    recordAttendance,
    calculateSalary,
    recordWork,
    getEmployeeAttendance,
    getEmployeeSalaryRecords,
    getEmployeeWorkRecords,
    getEmployeesByRole,
    approveSalary,
    markSalaryAsPaid,
  } = useEmployeeManagement();

  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showSalaryDialog, setShowSalaryDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [showWorkDialog, setShowWorkDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || emp.position === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setShowEmployeeDialog(true);
  };

  const handleEditEmployee = (emp: typeof employees[0]) => {
    setEditingEmployee(emp);
    setShowEmployeeDialog(true);
  };

  const handleSaveEmployee = (data: Partial<typeof employees[0]>) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, data);
    } else {
      createEmployee(data as any);
    }
    setShowEmployeeDialog(false);
  };

  const handleDeleteEmployee = (id: string) => {
    deleteEmployee(id);
    if (selectedEmployee?.id === id) {
      setSelectedEmployee(employees[0]);
    }
  };

  const handleRecordAttendance = (checkIn: string, checkOut?: string) => {
    if (selectedEmployee) {
      recordAttendance(selectedEmployee.id, checkIn, checkOut);
      setShowAttendanceDialog(false);
    }
  };

  const handleCalculateSalary = (bonus: number, deductions: number) => {
    if (selectedEmployee) {
      calculateSalary(
        selectedEmployee.id,
        new Date().getMonth() + 1,
        new Date().getFullYear(),
        bonus,
        deductions,
      );
      updateEmployee(selectedEmployee.id, { bonus, deductions });
      setShowSalaryDialog(false);
    }
  };

  const handleRecordWork = (
    taskDescription: string,
    hoursWorked: number,
  ) => {
    if (selectedEmployee) {
      recordWork(selectedEmployee.id, taskDescription, hoursWorked);
      setShowWorkDialog(false);
    }
  };

  const statusConfig = {
    active: {
      label: "Hoạt Động",
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      icon: CheckCircle2,
    },
    inactive: {
      label: "Không Hoạt Động",
      color: "bg-slate-500/20 text-slate-300 border-slate-500/50",
      icon: AlertCircle,
    },
    "on-leave": {
      label: "Đang Nghỉ",
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      icon: Clock,
    },
  };

  const positionLabels: Record<string, string> = {
    staff: "Nhân Viên",
    server: "Phục Vụ",
    cashier: "Thu Ngân",
  };

  const employeeAttendance = selectedEmployee
    ? getEmployeeAttendance(selectedEmployee.id)
    : [];
  const employeeSalary = selectedEmployee
    ? getEmployeeSalaryRecords(selectedEmployee.id)
    : [];
  const employeeWork = selectedEmployee
    ? getEmployeeWorkRecords(selectedEmployee.id)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <Users size={24} className="text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Quản Lý Nhân Viên
              </h1>
            </div>
            <p className="text-slate-400 text-base ml-11">
              Quản lý nhân viên, điểm danh, tính lương và công việc
            </p>
          </div>
          <Button
            onClick={handleCreateEmployee}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            <Plus size={20} />
            Thêm Nhân Viên
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employees Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-6 sticky top-6 max-h-[calc(100vh-8rem)] flex flex-col">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={20} className="text-blue-400" />
                  Danh Sách Nhân Viên
                </h2>

                <div className="space-y-4">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-3 text-slate-500"
                      size={18}
                    />
                    <Input
                      placeholder="Tìm nhân viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white pl-10 placeholder:text-slate-600 focus:border-blue-500/50"
                    />
                  </div>

                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white">
                      <SelectValue placeholder="Lọc theo chức vụ" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all" className="text-white">
                        Tất Cả Chức Vụ
                      </SelectItem>
                      <SelectItem value="staff" className="text-white">
                        Nhân Viên
                      </SelectItem>
                      <SelectItem value="server" className="text-white">
                        Phục Vụ
                      </SelectItem>
                      <SelectItem value="cashier" className="text-white">
                        Thu Ngân
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 overflow-y-auto flex-1">
                {filteredEmployees.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    Không có nhân viên
                  </p>
                ) : (
                  filteredEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className={`w-full text-left p-4 rounded-lg transition-all border ${
                        selectedEmployee?.id === emp.id
                          ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/50 text-white shadow-lg"
                          : "bg-slate-700/30 border-slate-700/30 text-slate-300 hover:bg-slate-700/60"
                      }`}
                    >
                      <h3 className="font-semibold line-clamp-1">{emp.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {positionLabels[emp.position]}
                      </p>
                      <Badge
                        className={`text-xs mt-2 ${statusConfig[emp.status as keyof typeof statusConfig]?.color}`}
                      >
                        {statusConfig[emp.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Employee Details */}
          <div className="lg:col-span-2">
            {selectedEmployee ? (
              <div className="space-y-6">
                {/* Employee Info Card */}
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-black text-white mb-2">
                        {selectedEmployee.name}
                      </h2>
                      <div className="flex items-center gap-2 text-slate-400 mb-3">
                        <Mail size={16} />
                        {selectedEmployee.email}
                      </div>
                      <p className="text-slate-400 text-sm">
                        {selectedEmployee.phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditEmployee(selectedEmployee)}
                        className="bg-blue-600/80 hover:bg-blue-600 text-white gap-2 px-4 py-2 rounded-lg text-sm"
                      >
                        <Edit size={16} />
                        Sửa
                      </Button>
                      <Button
                        onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                        className="bg-red-600/20 text-red-400 hover:bg-red-600/40 gap-2 px-4 py-2 rounded-lg text-sm border border-red-500/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-2 uppercase">
                        Chức Vụ
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {positionLabels[selectedEmployee.position]}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-2 uppercase">
                        Trạng Thái
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {
                          statusConfig[
                            selectedEmployee.status as keyof typeof statusConfig
                          ]?.label
                        }
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-2 uppercase">
                        Lương Cơ Bản
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {(selectedEmployee.baseSalary / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-2 uppercase">
                        Tổng Lương
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {(selectedEmployee.salary / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Tabs for different sections */}
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 overflow-hidden">
                  <Tabs defaultValue="attendance" className="w-full">
                    <TabsList className="bg-slate-700/50 border-b border-slate-700 w-full justify-start rounded-none">
                      <TabsTrigger value="attendance" className="gap-2">
                        <Calendar size={16} />
                        Điểm Danh
                      </TabsTrigger>
                      <TabsTrigger value="salary" className="gap-2">
                        <DollarSign size={16} />
                        Lương
                      </TabsTrigger>
                      <TabsTrigger value="work" className="gap-2">
                        <CheckSquare size={16} />
                        Công Việc
                      </TabsTrigger>
                    </TabsList>

                    {/* Attendance Tab */}
                    <TabsContent value="attendance" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">
                          Lịch Điểm Danh
                        </h3>
                        <Button
                          onClick={() => setShowAttendanceDialog(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm"
                        >
                          <Plus size={16} />
                          Ghi Nhận
                        </Button>
                      </div>

                      {employeeAttendance.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-slate-700 hover:bg-transparent">
                                <TableHead className="text-slate-300">
                                  Ngày
                                </TableHead>
                                <TableHead className="text-slate-300">
                                  Giờ Vào
                                </TableHead>
                                <TableHead className="text-slate-300">
                                  Giờ Ra
                                </TableHead>
                                <TableHead className="text-slate-300">
                                  Trạng Thái
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {employeeAttendance.map((record) => (
                                <TableRow
                                  key={record.id}
                                  className="border-slate-700 hover:bg-slate-700/20"
                                >
                                  <TableCell className="text-white">
                                    {new Date(record.date).toLocaleDateString(
                                      "vi-VN",
                                    )}
                                  </TableCell>
                                  <TableCell className="text-slate-300">
                                    {record.checkIn}
                                  </TableCell>
                                  <TableCell className="text-slate-300">
                                    {record.checkOut || "-"}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        record.status === "present"
                                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 border"
                                          : "bg-red-500/20 text-red-300 border-red-500/50 border"
                                      }
                                    >
                                      {record.status === "present"
                                        ? "Có Mặt"
                                        : record.status === "late"
                                          ? "Đi Muộn"
                                          : "Vắng"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-8">
                          Chưa có dữ liệu điểm danh
                        </p>
                      )}
                    </TabsContent>

                    {/* Salary Tab */}
                    <TabsContent value="salary" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">
                          Lịch Sử Lương
                        </h3>
                        <Button
                          onClick={() => setShowSalaryDialog(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm"
                        >
                          <Plus size={16} />
                          Tính Lương
                        </Button>
                      </div>

                      {employeeSalary.length > 0 ? (
                        <div className="space-y-4">
                          {employeeSalary.map((record) => (
                            <div
                              key={record.id}
                              className="p-4 rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-700/50 group"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="text-white font-semibold">
                                    Tháng {record.month}/{record.year}
                                  </p>
                                  <p className="text-slate-400 text-sm mt-1">
                                    Lương Cơ Bản:{" "}
                                    {record.baseSalary.toLocaleString("vi-VN")}{" "}
                                    VNĐ
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    record.status === "paid"
                                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 border"
                                      : record.status === "approved"
                                        ? "bg-blue-500/20 text-blue-300 border-blue-500/50 border"
                                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/50 border"
                                  }
                                >
                                  {record.status === "paid"
                                    ? "Đã Trả"
                                    : record.status === "approved"
                                      ? "Đã Duyệt"
                                      : "Chờ Duyệt"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <p className="text-slate-400">
                                  Thưởng:{" "}
                                  <span className="text-emerald-400">
                                    +{record.bonus.toLocaleString("vi-VN")}
                                  </span>
                                </p>
                                <p className="text-slate-400">
                                  Khấu Trừ:{" "}
                                  <span className="text-red-400">
                                    -{record.deductions.toLocaleString("vi-VN")}
                                  </span>
                                </p>
                                <p className="text-white font-bold text-right">
                                  {record.totalSalary.toLocaleString("vi-VN")}{" "}
                                  VNĐ
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-8">
                          Chưa có dữ liệu lương
                        </p>
                      )}
                    </TabsContent>

                    {/* Work Tab */}
                    <TabsContent value="work" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">
                          Công Việc Đã Ghi Nhận
                        </h3>
                        <Button
                          onClick={() => setShowWorkDialog(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm"
                        >
                          <Plus size={16} />
                          Ghi Nhận
                        </Button>
                      </div>

                      {employeeWork.length > 0 ? (
                        <div className="space-y-4">
                          {employeeWork.map((record) => (
                            <div
                              key={record.id}
                              className="p-4 rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-700/50"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="text-white font-semibold">
                                    {record.taskDescription}
                                  </p>
                                  <p className="text-slate-400 text-xs mt-2">
                                    {new Date(record.date).toLocaleDateString(
                                      "vi-VN",
                                    )}
                                  </p>
                                </div>
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 border text-xs">
                                  {record.hoursWorked}h
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-8">
                          Chưa có công việc nào được ghi nhận
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 p-12 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="inline-block p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl mb-4">
                    <Users size={48} className="text-blue-400" />
                  </div>
                  <p className="text-slate-300 font-medium">
                    Chọn một nhân viên từ danh sách
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EmployeeDialog
        employee={editingEmployee}
        isOpen={showEmployeeDialog}
        onClose={() => setShowEmployeeDialog(false)}
        onSave={handleSaveEmployee}
      />
      <SalaryDialog
        employee={selectedEmployee}
        isOpen={showSalaryDialog}
        onClose={() => setShowSalaryDialog(false)}
        onSave={handleCalculateSalary}
      />
      <AttendanceDialog
        employee={selectedEmployee}
        isOpen={showAttendanceDialog}
        onClose={() => setShowAttendanceDialog(false)}
        onSave={handleRecordAttendance}
      />
      <WorkDialog
        employee={selectedEmployee}
        isOpen={showWorkDialog}
        onClose={() => setShowWorkDialog(false)}
        onSave={handleRecordWork}
      />
    </div>
  );
}
