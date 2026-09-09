import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 pt-1">
          <SidebarTrigger className="-ml-1 rounded-full border border-border/70 bg-card shadow-sm" />
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
        </div>
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
              {title}
            </h1>
            {description ? (
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
        </div>
      </div>
      <Separator className="bg-border/80" />
    </div>
  );
}
