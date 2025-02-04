import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return <ProductListSkeleton />;
}

export function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="w-full max-w-sm">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-[90%]" />
                  <Skeleton className="h-3 w-[85%]" />
                  <Skeleton className="h-3 w-[70%]" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Skeleton className="h-10 w-[300px]" />
      </div>
    </div>
  );
}