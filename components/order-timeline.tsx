import { cn } from "@/lib/utils";

export type TimelineTone = "success" | "warning" | "info" | "danger" | "neutral";

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  tone?: TimelineTone;
};

const toneClasses: Record<TimelineTone, string> = {
  success: "bg-emerald-500 text-emerald-600",
  warning: "bg-amber-500 text-amber-600",
  info: "bg-sky-500 text-sky-600",
  danger: "bg-rose-500 text-rose-600",
  neutral: "bg-slate-400 text-slate-600"
};

export function OrderTimeline({
  items,
  emptyMessage = "Chưa có cập nhật nào."
}: {
  items: TimelineItem[];
  emptyMessage?: string;
}) {
  if (!items.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] px-5 py-6 text-sm text-[color:var(--text-soft)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item, index) => {
        const tone = item.tone ?? "neutral";

        return (
          <div key={item.id} className="relative pl-8">
            {index < items.length - 1 ? (
              <span className="absolute left-[11px] top-6 h-[calc(100%+0.75rem)] w-px bg-[color:var(--line)]" />
            ) : null}
            <span
              className={cn(
                "absolute left-0 top-1.5 inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border-4 border-white shadow-sm",
                toneClasses[tone]
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-current" />
            </span>

            <div className="rounded-[24px] border border-[color:var(--line)] bg-white/82 px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-[color:var(--text)]">
                  {item.title}
                </h3>
                {item.meta ? (
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
                    {item.meta}
                  </p>
                ) : null}
              </div>
              {item.description ? (
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                  {item.description}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
