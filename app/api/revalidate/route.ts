import { revalidateTag } from "next/cache";

export async function POST() {
  revalidateTag("products", "max");
  return Response.json({ revalidated: true });
}
