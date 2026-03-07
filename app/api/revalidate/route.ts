import { revalidatePath } from "next/cache";

export async function POST() {
  revalidatePath("/menu");
  return Response.json({ revalidated: true });
}
