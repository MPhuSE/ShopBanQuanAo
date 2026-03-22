import { AdminNav } from "@/components/layout/admin-nav";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0f172a_0%,#15213a_18rem,var(--background)_18rem,var(--background)_100%)]">
      <AdminNav />
      <main className="container-shell pb-16 pt-8 md:pb-20 md:pt-10">{children}</main>
    </div>
  );
}
