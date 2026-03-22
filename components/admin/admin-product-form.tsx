"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

type ProductFormValues = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  bannerImageUrl: string;
  price: number;
  stockQuantity: number;
  currency: string;
  status: "active" | "draft" | "inactive";
};

type Props = {
  mode: "create" | "edit";
  initialValues?: ProductFormValues;
  productId?: string;
};

const defaultValues: ProductFormValues = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  bannerImageUrl: "",
  price: 0,
  stockQuantity: 0,
  currency: "VND",
  status: "active"
};

export function AdminProductForm({
  mode,
  initialValues = defaultValues,
  productId
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>(initialValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error">("success");
  const isEdit = mode === "edit";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch(
      isEdit ? `/api/admin/products/${productId}` : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      }
    );

    const data = (await response.json()) as {
      error?: string;
      success?: boolean;
      product?: { id: string };
    };

    if (!response.ok || !data.success) {
      setToastTone("error");
      setMessage(data.error || "Không thể lưu sản phẩm.");
      setLoading(false);
      return;
    }

    setToastTone("success");
    setMessage(isEdit ? "Cập nhật sản phẩm thành công." : "Đã tạo sản phẩm mới.");
    setLoading(false);

    if (!isEdit && data.product?.id) {
      setForm(defaultValues);
      router.push(`/admin/products/${data.product.id}`);
    }

    router.refresh();
  }

  function updateField<Key extends keyof ProductFormValues>(
    key: Key,
    value: ProductFormValues[Key]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-[34px] p-6 md:p-7">
      <Toast open={Boolean(message)} message={message} tone={toastTone} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">{isEdit ? "Cập nhật sản phẩm" : "Sản phẩm mới"}</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text)]">
            {isEdit ? "Chỉnh sửa thông tin sản phẩm" : "Thêm sản phẩm để bán"}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          Tên sản phẩm
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="field"
            placeholder="Canva Pro 12 tháng"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Slug
          <input
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            className="field"
            placeholder="canva-pro-12-thang"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Trạng thái
          <select
            value={form.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as ProductFormValues["status"]
              )
            }
            className="field-select"
          >
            <option value="active">active</option>
            <option value="draft">draft</option>
            <option value="inactive">inactive</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Giá
          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(event) => updateField("price", Number(event.target.value))}
            className="field"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Tồn kho
          <input
            type="number"
            min={0}
            value={form.stockQuantity}
            onChange={(event) => updateField("stockQuantity", Number(event.target.value))}
            className="field"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Đơn vị tiền tệ
          <input
            value={form.currency}
            onChange={(event) => updateField("currency", event.target.value)}
            className="field"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          URL ảnh sản phẩm
          <input
            value={form.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            className="field"
            placeholder="https://..."
          />
        </label>

        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          Banner URL
          <input
            value={form.bannerImageUrl}
            onChange={(event) => updateField("bannerImageUrl", event.target.value)}
            className="field"
            placeholder="https://..."
          />
        </label>

        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          Mô tả ngắn
          <textarea
            value={form.shortDescription}
            onChange={(event) => updateField("shortDescription", event.target.value)}
            className="field-area min-h-28"
            placeholder="Tóm tắt ngắn để hiển thị trong danh sách sản phẩm"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          Mô tả chi tiết
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="field-area min-h-40"
            placeholder="Nội dung chi tiết để hiển thị tại trang sản phẩm"
          />
        </label>
      </div>

      {(form.imageUrl || form.bannerImageUrl) ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="surface-panel overflow-hidden rounded-[24px]">
            {form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="Xem trước ảnh sản phẩm"
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-[color:var(--text-soft)]">
                Chưa có ảnh sản phẩm
              </div>
            )}
          </div>
          <div className="surface-panel overflow-hidden rounded-[24px]">
            {form.bannerImageUrl ? (
              <img
                src={form.bannerImageUrl}
                alt="Xem trước banner sản phẩm"
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-[color:var(--text-soft)]">
                Chưa có banner
              </div>
            )}
          </div>
        </div>
      ) : null}

      {message ? (
        <p className="mt-5 rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--text-soft)]">
          {message}
        </p>
      ) : null}

      <div className="mt-6">
        <Button type="submit" loading={loading} size="lg">
          {loading ? "Đang lưu..." : isEdit ? "Lưu cập nhật" : "Tạo sản phẩm"}
        </Button>
      </div>
    </form>
  );
}
