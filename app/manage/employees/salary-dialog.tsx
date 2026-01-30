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
import { Employee } from "@/constants/types/employee.type";
import { useState, useEffect } from "react";

interface SalaryDialogProps {
  employee?: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bonus: number, deductions: number) => void;
}

export function SalaryDialog({
  employee,
  isOpen,
  onClose,
  onSave,
}: SalaryDialogProps) {
  const [bonus, setBonus] = useState(0);
  const [deductions, setDeductions] = useState(0);

  useEffect(() => {
    if (employee) {
      setBonus(employee.bonus || 0);
      setDeductions(employee.deductions || 0);
    }
  }, [employee, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(bonus, deductions);
  };

  const baseSalary = employee?.baseSalary || 0;
  const totalSalary = baseSalary + bonus - deductions;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Tính Lương</DialogTitle>
          <DialogDescription className="text-slate-400">
            Tính toán lương cho {employee?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-slate-400 text-sm">Lương Cơ Bản</p>
              <p className="text-white text-lg font-semibold">
                {baseSalary.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <Label className="text-slate-300">Thưởng (VNĐ)</Label>
              <Input
                type="number"
                value={bonus}
                onChange={(e) => setBonus(parseFloat(e.target.value))}
                placeholder="0"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-600 mt-1"
              />
            </div>

            <div>
              <Label className="text-slate-300">Khấu Trừ (VNĐ)</Label>
              <Input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(parseFloat(e.target.value))}
                placeholder="0"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-600 mt-1"
              />
            </div>

            <div className="border-t border-slate-700 pt-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-3 rounded">
              <p className="text-slate-400 text-sm mb-1">Tổng Lương</p>
              <p className="text-white text-2xl font-bold">
                {totalSalary.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
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
              Xác Nhận
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
