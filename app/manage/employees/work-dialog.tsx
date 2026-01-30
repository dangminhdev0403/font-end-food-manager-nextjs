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
import { Textarea } from "@/components/ui/textarea";
import { Employee } from "@/constants/types/employee.type";
import { useState } from "react";

interface WorkDialogProps {
  employee?: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskDescription: string, hoursWorked: number) => void;
}

export function WorkDialog({
  employee,
  isOpen,
  onClose,
  onSave,
}: WorkDialogProps) {
  const [taskDescription, setTaskDescription] = useState("");
  const [hoursWorked, setHoursWorked] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskDescription.trim()) {
      onSave(taskDescription, hoursWorked);
      setTaskDescription("");
      setHoursWorked(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Ghi Nhận Công Việc</DialogTitle>
          <DialogDescription className="text-slate-400">
            Ghi nhận công việc cho {employee?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Mô Tả Công Việc</Label>
            <Textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Mô tả công việc hoàn thành..."
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-600 mt-1 min-h-24"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300">Giờ Làm Việc</Label>
            <Input
              type="number"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(parseFloat(e.target.value))}
              placeholder="8"
              step="0.5"
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
              Ghi Nhận
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
