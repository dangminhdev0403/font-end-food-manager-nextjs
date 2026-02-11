"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

interface QRCodeModalProps {
  tableToken: string;
  tableName: string;
  onClose: () => void;
}

export default function QRCodeModal({
  tableToken,
  tableName,
  onClose,
}: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);

  // Tránh hydration mismatch
  useEffect(() => {
    setQrValue(`${window.location.origin}/table/${tableToken}`);
  }, [tableToken]);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${tableName}-QR.png`;
    link.click();
  };

  const handleCopyLink = async () => {
    if (!qrValue) return;
    await navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!qrValue) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Mã QR - {tableName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* QR Section */}
          <div
            ref={qrRef}
            className="bg-white p-6 rounded-2xl shadow-md border"
          >
            <QRCodeCanvas value={qrValue} size={220} level="Q"  />
          </div>

          {/* Link Display */}
          <div className="w-full space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              Link truy cập
            </p>
            <div className="bg-muted rounded-md px-3 py-2 text-xs font-mono break-all text-center">
              {qrValue}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <Button onClick={handleDownload} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Tải xuống
            </Button>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              disabled={copied}
              className="flex-1 gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Đã sao chép
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Sao chép
                </>
              )}
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            Khách quét mã để xem menu và đặt món trực tiếp.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
