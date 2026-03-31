import { cn } from '@/lib/utils';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('skeleton rounded-md', className)} {...props} />
);

export const EventCardSkeleton = () => (
  <div className="rounded-xl bg-surface-container-lowest p-0 shadow-ambient overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="pt-2">
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  </div>
);
