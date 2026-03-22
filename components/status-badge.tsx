import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
};

type BadgeTone = "success" | "warning" | "info" | "danger" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-700"
};

const statusMeta: Record<string, { label: string; tone: BadgeTone }> = {
  active: { label: "Đang bán", tone: "success" },
  draft: { label: "Bản nháp", tone: "neutral" },
  inactive: { label: "Tạm ẩn", tone: "neutral" },
  pending: { label: "Đang đợi", tone: "warning" },
  unpaid: { label: "Chưa thanh toán", tone: "neutral" },
  paid: { label: "Đã thanh toán", tone: "success" },
  failed: { label: "Thất bại", tone: "danger" },
  pending_payment: { label: "Chờ thanh toán", tone: "warning" },
  processing: { label: "Đang xử lý", tone: "info" },
  completed: { label: "Hoàn tất", tone: "success" },
  cancelled: { label: "Đã hủy", tone: "neutral" },
  payment_failed: { label: "Lỗi thanh toán", tone: "danger" }
};

export function getStatusMeta(status: string) {
  return (
    statusMeta[status] ?? {
      label: status.replaceAll("_", " "),
      tone: "neutral" as const
    }
  );
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = getStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
        toneClasses[meta.tone]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
      {meta.label}
    </span>
  );
}
