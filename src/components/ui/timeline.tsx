import { cn } from "@/lib/utils";

interface TimelineItemProps {
  title: string;
  time?: string;
  description?: string;
  icon?: React.ReactNode;
  isLast?: boolean;
}

export function TimelineItem({ title, time, description, icon, isLast }: TimelineItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {icon}
        </div>
        {!isLast && <div className="h-full w-0.5 bg-border" />}
      </div>
      <div className={cn("pb-6", isLast && "pb-0")}>
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          {time && <span className="text-xs text-muted-foreground">{time}</span>}
        </div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}