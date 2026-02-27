// app/tables/detail/[id]/page.tsx

import TableOrderingPage from "@/app/tables/detail/[id]/TableOrderingPage";
import customerServer from "@/services/internal/customers/customer.server";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const tableId = Number((await params).id);
    const table = await customerServer.findTableById(tableId);
    

    return <TableOrderingPage table={table.data} />;
  } catch (error: any) {
    if (error.status === 404) {
      notFound();
    }

    redirect("/");
  }
}
