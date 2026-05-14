"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

  useEffect(() => {
    setQrValue(`${globalThis.location.origin}/tables/scan/${tableToken}`);
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
          <DialogTitle className="text-center">
            Mã QR — {tableName}
          </DialogTitle>
          <DialogDescription className="text-center">
            Khách quét mã để xem menu và đặt món trực tiếp.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-2">
          <div
            ref={qrRef}
            className="rounded-md border border-border bg-white p-4 shadow-sm"
          >
            <QRCodeCanvas value={qrValue} size={220} level="Q" />
          </div>

          <div className="w-full space-y-2">
            <p className="text-center text-xs text-muted-foreground">
              Link truy cập
            </p>
            <p className="break-all rounded-md bg-muted px-3 py-2 text-center font-mono text-xs text-foreground">
              {qrValue}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            disabled={copied}
            className="h-11 flex-1 gap-2"
          >
            {copied ? (
              <>
                <Check className="size-4" aria-hidden />
                Đã sao chép
              </>
            ) : (
              <>
                <Copy className="size-4" aria-hidden />
                Sao chép
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            className="h-11 flex-1 gap-2"
          >
            <Download className="size-4" aria-hidden />
            Tải xuống
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
