"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/orders");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-[34px] p-7 md:p-8">
      <Toast open={Boolean(error)} message={error} tone="error" />
      <p className="section-kicker">Đăng nhập quản trị</p>
      <h2 className="mt-3 text-3xl font-semibold text-[color:var(--text)]">
        Đăng nhập khu vực vận hành
      </h2>
      <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
        Đăng nhập bằng tài khoản Supabase Auth đã được cấp quyền quản trị.
      </p>

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="field"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="field"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <Button type="submit" loading={loading} fullWidth size="lg" className="mt-6">
        {loading ? "Đang đăng nhập..." : "Đăng nhập quản trị"}
      </Button>
    </form>
  );
}
