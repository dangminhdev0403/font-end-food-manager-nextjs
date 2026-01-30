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
import { Employee } from "@/constants/types/employee.type";
import { useState } from "react";

interface AttendanceDialogProps {
  employee?: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (checkIn: string, checkOut?: string) => void;
}

export function AttendanceDialog({
  employee,
  isOpen,
  onClose,
  onSave,
}: AttendanceDialogProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("present");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(checkIn, checkOut || undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Điểm Danh</DialogTitle>
          <DialogDescription className="text-slate-400">
            Ghi nhận điểm danh cho {employee?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Giờ Vào</Label>
            <Input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white mt-1"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300">Giờ Ra</Label>
            <Input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-slate-300">Trạng Thái</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem
                  value="present"
                  className="text-white hover:bg-slate-700"
                >
                  Có Mặt
                </SelectItem>
                <SelectItem
                  value="absent"
                  className="text-white hover:bg-slate-700"
                >
                  Vắng Mặt
                </SelectItem>
                <SelectItem
                  value="late"
                  className="text-white hover:bg-slate-700"
                >
                  Đi Muộn
                </SelectItem>
                <SelectItem
                  value="half-day"
                  className="text-white hover:bg-slate-700"
                >
                  Nửa Ngày
                </SelectItem>
              </SelectContent>
            </Select>
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
              Ghi Nhận
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
