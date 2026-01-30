"use client";

import {
  AttendanceRecord,
  Employee,
  EmployeeRole,
  EmployeeWork,
  SalaryRecord,
} from "@/constants/types/employee.type";
import { useState, useCallback } from "react";

export function useEmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "nguyena@restaurant.com",
      phone: "0912345678",
      position: "staff",
      status: "active",
      baseSalary: 7000000,
      salary: 7500000,
      bonus: 500000,
      deductions: 0,
      joinDate: new Date("2023-01-15"),
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "tranb@restaurant.com",
      phone: "0987654321",
      position: "server",
      status: "active",
      baseSalary: 5000000,
      salary: 5200000,
      bonus: 200000,
      deductions: 0,
      joinDate: new Date("2023-03-20"),
      createdAt: new Date("2023-03-20"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "3",
      name: "Lê Văn C",
      email: "levanc@restaurant.com",
      phone: "0923456789",
      position: "cashier",
      status: "active",
      baseSalary: 6000000,
      salary: 6000000,
      bonus: 0,
      deductions: 0,
      joinDate: new Date("2023-06-10"),
      createdAt: new Date("2023-06-10"),
      updatedAt: new Date("2024-01-15"),
    },
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(
    [
      {
        id: "att-1",
        employeeId: "1",
        date: new Date(),
        checkIn: "08:00",
        checkOut: "17:00",
        status: "present",
        createdAt: new Date(),
      },
      {
        id: "att-2",
        employeeId: "2",
        date: new Date(),
        checkIn: "08:15",
        checkOut: "17:30",
        status: "late",
        createdAt: new Date(),
      },
    ],
  );

  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([
    {
      id: "sal-1",
      employeeId: "1",
      month: 1,
      year: 2024,
      baseSalary: 7000000,
      bonus: 500000,
      deductions: 0,
      totalSalary: 7500000,
      status: "paid",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [workRecords, setWorkRecords] = useState<EmployeeWork[]>([
    {
      id: "work-1",
      employeeId: "1",
      date: new Date(),
      taskDescription: "Chuẩn bị bếp, nấu ăn",
      hoursWorked: 8,
      status: "completed",
      createdAt: new Date(),
    },
  ]);

  const createEmployee = useCallback((data: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    const newEmployee: Employee = {
      ...data,
      id: `emp-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
    return newEmployee;
  }, []);

  const updateEmployee = useCallback((id: string, data: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, ...data, updatedAt: new Date() } : emp,
      ),
    );
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  const recordAttendance = useCallback(
    (employeeId: string, checkIn: string, checkOut?: string) => {
      const record: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId,
        date: new Date(),
        checkIn,
        checkOut,
        status: checkOut ? "present" : "present",
        createdAt: new Date(),
      };
      setAttendanceRecords((prev) => [...prev, record]);
      return record;
    },
    [],
  );

  const calculateSalary = useCallback(
    (employeeId: string, month: number, year: number, bonus: number = 0, deductions: number = 0) => {
      const employee = employees.find((e) => e.id === employeeId);
      if (!employee) return null;

      const totalSalary = employee.baseSalary + bonus - deductions;
      const salaryRecord: SalaryRecord = {
        id: `sal-${Date.now()}`,
        employeeId,
        month,
        year,
        baseSalary: employee.baseSalary,
        bonus,
        deductions,
        totalSalary,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSalaryRecords((prev) => [...prev, salaryRecord]);
      updateEmployee(employeeId, {
        salary: totalSalary,
        bonus,
        deductions,
      });
      return salaryRecord;
    },
    [employees, updateEmployee],
  );

  const recordWork = useCallback(
    (employeeId: string, taskDescription: string, hoursWorked: number) => {
      const work: EmployeeWork = {
        id: `work-${Date.now()}`,
        employeeId,
        date: new Date(),
        taskDescription,
        hoursWorked,
        status: "completed",
        createdAt: new Date(),
      };
      setWorkRecords((prev) => [...prev, work]);
      return work;
    },
    [],
  );

  const getEmployeeAttendance = useCallback(
    (employeeId: string) => {
      return attendanceRecords.filter((r) => r.employeeId === employeeId);
    },
    [attendanceRecords],
  );

  const getEmployeeSalaryRecords = useCallback(
    (employeeId: string) => {
      return salaryRecords.filter((r) => r.employeeId === employeeId);
    },
    [salaryRecords],
  );

  const getEmployeeWorkRecords = useCallback(
    (employeeId: string) => {
      return workRecords.filter((r) => r.employeeId === employeeId);
    },
    [workRecords],
  );

  const getEmployeesByRole = useCallback(
    (role: EmployeeRole) => {
      return employees.filter((e) => e.position === role);
    },
    [employees],
  );

  const approveSalary = useCallback((salaryId: string) => {
    setSalaryRecords((prev) =>
      prev.map((sal) =>
        sal.id === salaryId ? { ...sal, status: "approved" } : sal,
      ),
    );
  }, []);

  const markSalaryAsPaid = useCallback((salaryId: string) => {
    setSalaryRecords((prev) =>
      prev.map((sal) =>
        sal.id === salaryId ? { ...sal, status: "paid" } : sal,
      ),
    );
  }, []);

  return {
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
  };
}
