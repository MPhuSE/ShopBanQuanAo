import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "success";
type ButtonSize = "sm" | "md" | "lg";

type ButtonVariantOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

const baseClasses =
  "relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(99,102,241,0.18)] disabled:pointer-events-none disabled:opacity-60 active:scale-[0.99]";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,var(--brand-from),var(--brand-to))] text-white shadow-[0_18px_50px_rgba(79,70,229,0.28)] hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(79,70,229,0.34)]",
  secondary:
    "border border-[color:var(--line)] bg-white/85 text-[color:var(--text)] shadow-[0_12px_30px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-[color:var(--line-strong)] hover:bg-white",
  ghost:
    "bg-transparent text-[color:var(--text-soft)] hover:bg-white/70 hover:text-[color:var(--text)]",
  success:
    "bg-emerald-600 text-white shadow-[0_18px_50px_rgba(16,185,129,0.24)] hover:-translate-y-0.5 hover:bg-emerald-500"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4",
  md: "h-11 px-5",
  lg: "h-12 px-6 text-[0.95rem]"
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className
}: ButtonVariantOptions = {}) {
  return cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantOptions & {
    loading?: boolean;
  };

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current/35 border-t-current" />
      ) : null}
      {children}
    </button>
  );
}
