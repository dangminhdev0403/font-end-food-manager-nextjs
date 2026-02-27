"use client";

import ScanTableError from "@/components/errors/scan-table";
import { toast } from "@/components/ui/use-toast";
import WelcomePage from "@/components/welcome-page";
import { logger } from "@/lib/logger";
import customerClient from "@/services/internal/customers/customer.client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function ScanTablePage() {
  const [guestToken, setGuestToken] = useLocalStorage<string | null>(
    "guestToken",
    null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [tableId, setTableId] = useState<number | null>(null);
  const [hasTableError, setHasTableError] = useState(false);

  const params = useParams();

  const uuid = params.uuid as string;
  useEffect(() => {
    if (!uuid) return;
    (async () => {
      try {
        const res = await customerClient.scanQrCode(uuid);
        if (res.data) logger.info({ res }, "Scan QR code response:");
        setTableId(res.data.table.id);
      } catch (error: any) {
        if (error?.status === 409) {
          setHasTableError(true);
          toast({
            description: "Bàn đã có người sử dụng, vui lòng chọn bàn khác",
            variant: "destructive",
          });
        } else {
          toast({
            description: "Có lỗi xảy ra khi quét mã QR. Vui lòng thử lại.",
            variant: "destructive",
          });
          router.push("/");
        }
      }
    })();
  }, [uuid]);

  const handleNameSubmit = async (name: string) => {
    setIsLoading(true);

    try {
      const tableRes = await customerClient.createOrder({
        tableId: tableId!,
        guestName: name,
      });
      toast({
        description: "Đăng nhập thành công",
        variant: "success",
      });
      const guestToken = tableRes.data.guestToken;
      setGuestToken(guestToken);
      router.push(`/tables/detail/${tableId}`);
    } catch (error: any) {
      if (error?.status === 409) {
        setHasTableError(true);
      } else {
        toast({
          description: "Có lỗi xảy ra, vui lòng thử lại.",
          variant: "destructive",
        });
        router.push("/");
      }
    }
    setIsLoading(false);
  };
  if (hasTableError) {
    return <ScanTableError />;
  }
  return <WelcomePage onSubmit={handleNameSubmit} isLoading={isLoading} />;
}
