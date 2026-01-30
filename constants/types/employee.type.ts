export type EmployeeRole = "staff" | "server" | "cashier";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: EmployeeRole;
  status: "active" | "inactive" | "on-leave";
  salary: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  avatar?: string;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: Date;
  checkIn: string;
  checkOut?: string;
  status: "present" | "absent" | "late" | "half-day";
  notes?: string;
  createdAt: Date;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
  status: "pending" | "approved" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeWork {
  id: string;
  employeeId: string;
  date: Date;
  taskDescription: string;
  hoursWorked: number;
  status: "completed" | "in-progress" | "pending";
  createdAt: Date;
}
