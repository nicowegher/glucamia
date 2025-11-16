import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export default function TopBrand({ className = "" }: Props) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/web-app-manifest-512x512.png"
        alt="glucamia"
        className="h-6 w-6 rounded"
      />
      <span className="text-lg font-semibold tracking-tight text-foreground">
        glucamia
      </span>
    </div>
  );
}


