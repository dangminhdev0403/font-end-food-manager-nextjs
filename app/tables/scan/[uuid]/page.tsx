"use client";

import ScanTableError from "@/components/errors/scan-table";
import ScanTableExistError from "@/components/errors/scan-table-exsit";
import { toast } from "@/components/ui/use-toast";
import WelcomePage from "@/components/welcome-page";
import { logger } from "@/lib/logger";
import { useSessionStore } from "@/lib/stores/session.store";
import customerClient from "@/services/internal/customers/customer.client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScanTablePage() {
  const { tableId, setSession, hasHydrated } = useSessionStore();
  const [scannedTable, setScannedTable] = useState<{
    id: number;
    name: string;
  } | null>(null);
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
    logger.info({ tableId, hasHydrated }, "Session state before scan");
    if (!hasHydrated) return;
    if (!mounted) return;
    if (!uuid) return;
    if (scannedTable) return;
    /**
     * 🚨 đã có bàn trước đó
     */
    if (tableId) {
      logger.info({ tableId }, "Exixt table");
      setHasTableExistError(true);
      return;
    }
    (async () => {
      try {
        const res = await customerClient.scanQrCode(uuid);

        const scannedTableId = res.data.table.id;
        const scannedTableName = res.data.table.name;
        setScannedTable({
          id: scannedTableId,
          name: scannedTableName,
        });
        logger.info({ res }, "Scan QR code response:");
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
  }, [uuid, mounted, hasHydrated, tableId]);

  if (!mounted || !hasHydrated) return null;

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
    if (!scannedTable) return;
    setIsLoading(true);

    try {
      const tableRes = await customerClient.createOrder({
        tableId: scannedTable.id,
        guestName: name,
      });

      toast({
        description: "Đăng nhập thành công",
        variant: "success",
      });

      setSession({
        guestToken: tableRes.data.guestToken,
        orderId: tableRes.data.id,
        tableId: scannedTable.id,
        tableName: scannedTable.name,
      });
      router.push(`/tables/detail/${scannedTable.id}`);
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
