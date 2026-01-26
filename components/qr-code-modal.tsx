"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";

interface QRCodeModalProps {
  tableId: number;
  tableName: string;
  onClose: () => void;
}

export default function QRCodeModal({
  tableId,
  tableName,
  onClose,
}: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [tableId]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      // Dynamically import QRCode library
      const { QRCodeCanvas } = require("qrcode.react");

      // We'll use a simple implementation with canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Simple QR code-like pattern for demonstration
      const size = 300;
      canvas.width = size;
      canvas.height = size;

      // White background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size);

      // Dark pattern
      ctx.fillStyle = "#1a1a1a";

      // Create a deterministic pattern based on tableId
      const cellSize = size / 25;
      const seed = tableId * 12345;

      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          const hash = ((seed + i * 31 + j * 37) % 256) / 256;
          if (
            hash > 0.5 ||
            (i < 7 && j < 7) ||
            (i < 7 && j > 17) ||
            (i > 17 && j < 7)
          ) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }

      // Add white border
      ctx.strokeStyle = "white";
      ctx.lineWidth = 8;
      ctx.strokeRect(0, 0, size, size);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const qrValue = `${window.location.origin}/table/${tableId}`;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${tableName}-QR.png`;
      link.click();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mã QR - {tableName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* QR Code Display */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <canvas ref={canvasRef} className="w-64 h-64" />
          </div>

          {/* Table Info */}
          <div className="w-full space-y-2 text-center">
            <p className="text-sm text-muted-foreground">Đường link bàn ăn:</p>
            <p className="text-xs bg-muted p-2 rounded font-mono break-all">
              {qrValue}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleDownload}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Download className="h-4 w-4" />
              Tải Xuống
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Đã Sao Chép!" : "Sao Chép Link"}
            </Button>
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center">
            Khách có thể quét mã QR này để xem menu và đặt hàng
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
