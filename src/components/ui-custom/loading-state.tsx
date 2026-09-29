import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({ text = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 min-h-[200px]", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
}
