import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "light";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--earth)] text-white hover:bg-[color:var(--ink)]",
  outline:
    "border border-[color:var(--ink)] text-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-white",
  ghost:
    "text-[color:var(--ink)] story-link",
  light:
    "border border-white/70 text-white hover:bg-white hover:text-[color:var(--ink)]",
};

export function Button({ variant = "primary", className, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={cn(
        "btn-press inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-body text-sm uppercase tracking-[0.14em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
