import { Loader2 } from "lucide-react";

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Spinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return <Loader2 className={`${sizeClasses[size]} animate-spin ${className}`} />;
}
