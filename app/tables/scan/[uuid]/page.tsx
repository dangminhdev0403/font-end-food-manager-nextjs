"use client";

import ScanTableError from "@/components/errors/scan-table";
import ScanTableExistError from "@/components/errors/scan-table-exsit";
import { toast } from "@/components/ui/use-toast";
import WelcomePage from "@/components/welcome-page";
import { LOCAL_STORAGE_KEY } from "@/constants/keys/localStorage.key";
import { logger } from "@/lib/logger";
import customerClient from "@/services/internal/customers/customer.client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function ScanTablePage() {
  const [guestToken, setGuestToken] = useLocalStorage<string | null>(
    LOCAL_STORAGE_KEY.GUEST_TOKEN,
    null,
  );

  const [tableId, setTableId] = useLocalStorage<number | null>(
    LOCAL_STORAGE_KEY.TABLE_ID,
    null,
  );
  const [orderId, setOrderId] = useLocalStorage<number | null>(
    LOCAL_STORAGE_KEY.ORDER_ID,
    null,
  );
  const [tableName, setTableName] = useLocalStorage<string | null>(
    LOCAL_STORAGE_KEY.TABLE_NAME,
    null,
  );

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTableError, setHasTableError] = useState(false);
  const [hasTableExistError, setHasTableExistError] = useState(false);

  const router = useRouter();
  const params = useParams();
  const uuid = params.uuid as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * scan QR
   */
  useEffect(() => {
    if (!mounted) return;
    if (!uuid) return;

    (async () => {
      try {
        const res = await customerClient.scanQrCode(uuid);

        const scannedTableId = res.data.table.id;
        const scannedTableName = res.data.table.name;

        logger.info({ res }, "Scan QR code response:");

        /**
         * 🚨 đã có bàn trước đó
         */
        if (tableId) {
          /**
           * cùng bàn -> redirect luôn
           */
          if (tableId === scannedTableId) {
            router.replace(`/tables/detail/${tableId}`);
            return;
          }

          /**
           * khác bàn -> báo lỗi
           */
          setHasTableExistError(true);
          return;
        }

        /**
         * chưa có bàn -> lưu
         */
        setTableId(scannedTableId);
        setTableName(scannedTableName);
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
  }, [uuid, mounted]);

  if (!mounted) return null;

  /**
   * bàn đã bị chiếm
   */
  if (hasTableError) {
    return <ScanTableError />;
  }

  /**
   * đã có bàn trước đó
   */
  if (hasTableExistError) {
    return <ScanTableExistError />;
  }

  /**
   * submit tên khách
   */
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
      setOrderId(tableRes.data.id);
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

  return <WelcomePage onSubmit={handleNameSubmit} isLoading={isLoading} />;
}
