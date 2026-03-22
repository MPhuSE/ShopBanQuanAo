import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "neutral";

type ToastProps = {
  open: boolean;
  message: string | null;
  tone?: ToastTone;
};

const toneClasses: Record<ToastTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  neutral: "border-slate-200 bg-white text-slate-700"
};

export function Toast({ open, message, tone = "neutral" }: ToastProps) {
  if (!open || !message) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 right-5 z-[100] max-w-sm"
      role="status"
    >
      <div
        className={cn(
          "rounded-[22px] border px-4 py-3 text-sm font-medium shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur",
          toneClasses[tone]
        )}
      >
        {message}
      </div>
    </div>
  );
}
