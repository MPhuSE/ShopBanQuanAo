type ConfigNoticeProps = {
  title?: string;
  message: string;
};

export function ConfigNotice({
  title = "Can cau hinh moi truong",
  message
}: ConfigNoticeProps) {
  return (
    <div className="surface-card rounded-[28px] border border-dashed border-[color:var(--line-strong)] p-6 md:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">{message}</p>
    </div>
  );
}
