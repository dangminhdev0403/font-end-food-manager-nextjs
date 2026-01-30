"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee, EmployeeRole } from "@/constants/types/employee.type";
import { useState, useEffect } from "react";

interface EmployeeDialogProps {
  employee?: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
}

const positionOptions: { value: EmployeeRole; label: string }[] = [
  { value: "staff", label: "Nhân Viên" },
  { value: "server", label: "Phục Vụ" },
  { value: "cashier", label: "Thu Ngân" },
];

export function EmployeeDialog({
  employee,
  isOpen,
  onClose,
  onSave,
}: EmployeeDialogProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        position: "staff",
        status: "active",
        baseSalary: 0,
      });
    }
  }, [employee, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {employee ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên Mới"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {employee
              ? "Cập nhật thông tin nhân viên"
              : "Nhập thông tin nhân viên mới"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Tên Nhân Viên</Label>
            <Input
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên nhân viên"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-600 mt-1"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300">Email</Label>
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@restaurant.com"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-600 mt-1"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300">Số Điện Thoại</Label>
            <Input
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="0912345678"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-600 mt-1"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300">Chức Vụ</Label>
            <Select
              value={formData.position || "staff"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  position: value as EmployeeRole,
                })
              }
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {positionOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-slate-700"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Trạng Thái</Label>
            <Select
              value={formData.status || "active"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as "active" | "inactive" | "on-leave",
                })
              }
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem
                  value="active"
                  className="text-white hover:bg-slate-700"
                >
                  Hoạt Động
                </SelectItem>
                <SelectItem
                  value="inactive"
                  className="text-white hover:bg-slate-700"
                >
                  Không Hoạt Động
                </SelectItem>
                <SelectItem
                  value="on-leave"
                  className="text-white hover:bg-slate-700"
                >
                  Đang Nghỉ
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Lương Cơ Bản (VNĐ)</Label>
            <Input
              type="number"
              value={formData.baseSalary || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  baseSalary: parseFloat(e.target.value),
                })
              }
              placeholder="5000000"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-600 mt-1"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {employee ? "Cập Nhật" : "Thêm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
