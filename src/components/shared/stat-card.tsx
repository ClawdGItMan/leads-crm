import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
}) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex flex-wrap items-end gap-2">
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
            {change ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                  trend === "up" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                  trend === "down" && "border-rose-200 bg-rose-50 text-rose-700",
                  !trend && "border-border bg-secondary text-secondary-foreground"
                )}
              >
                {trend === "up" ? <ArrowUp className="h-3 w-3" /> : null}
                {trend === "down" ? <ArrowDown className="h-3 w-3" /> : null}
                {change}
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
