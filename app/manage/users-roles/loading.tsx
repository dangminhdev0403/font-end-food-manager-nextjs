import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-dvh bg-background">
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Skeleton className="h-12 w-full max-w-md" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="space-y-3 p-4 sm:p-6">
              {Array.from({ length: 5 }, (_, i) => `users-skeleton-${i}`).map(
                (key) => (
                  <Skeleton key={key} className="h-20 w-full" />
                ),
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
