import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AnimatedSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  delay?: number;
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  style,
  ...props
}: AnimatedSectionProps) {
  return (
    <section
      className={cn("public-animated-section scroll-mt-24", className)}
      style={
        {
          "--section-delay": `${delay}s`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </section>
  );
}
