import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        success: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-transparent",
        warning: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-transparent",
        error: "bg-red-100 text-red-800 hover:bg-red-100/80 border-transparent",
        info: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-transparent",
        neutral: "bg-slate-100 text-slate-800 hover:bg-slate-100/80 border-transparent",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

export function StatusBadge({ className, status, children, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {children}
    </div>
  );
}
