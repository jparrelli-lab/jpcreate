import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn("p-6 lg:p-8 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  );
}
