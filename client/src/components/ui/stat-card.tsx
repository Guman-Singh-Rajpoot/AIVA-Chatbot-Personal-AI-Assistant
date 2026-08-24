import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("glass-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-display tracking-tight text-glow">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "font-medium",
                  trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-yellow-500"
                )}
              >
                {trendValue}
              </span>
            )}
            <span className="opacity-70">{description}</span>
          </p>
        )}
      </CardContent>
      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
    </Card>
  );
}
