export const HubSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.5rem] border border-border bg-card/90 shadow-soft">
          <div className="aspect-[4/5] animate-pulse bg-muted/90" />
          <div className="grid gap-3 p-5">
            <div className="h-7 w-1/2 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted/60" />
            <div className="h-16 animate-pulse rounded-[1rem] bg-muted/40" />
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
};
