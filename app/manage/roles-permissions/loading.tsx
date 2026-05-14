import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-dvh bg-background">
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="space-y-3 p-4 sm:p-6">
              <Skeleton className="h-8 w-32" />
              {Array.from({ length: 4 }, (_, i) => `role-skeleton-${i}`).map(
                (key) => (
                  <Skeleton key={key} className="h-20 w-full" />
                ),
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
