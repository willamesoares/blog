type SkeletonProps = {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-border animate-pulse rounded motion-reduce:animate-none ${className}`}
    />
  )
}

export function PostItemSkeleton() {
  return (
    <div role="status" aria-label="Loading post">
      <Skeleton className="h-7 tablet:h-8 w-3/4 mb-3" />
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-5 w-full mt-3" />
      <Skeleton className="h-5 w-4/5 mt-1.5" />
    </div>
  )
}

export function PoemCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading poem"
      className="bg-poem-card border border-poem-border rounded-lg p-6 tablet:p-8 mb-6 break-inside-avoid"
    >
      <Skeleton className="h-6 tablet:h-7 w-1/3 mb-5" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div role="status" aria-label="Loading article" className="my-4">
      <Skeleton className="aspect-[16/9] w-full rounded-md border border-border" />
      <Skeleton className="h-3 w-1/3 mt-3" />
      <Skeleton className="h-10 tablet:h-12 w-5/6 mt-6 mb-3" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-1.5 mt-3">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
