"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function PostRowActions({
  postId,
  viewHref,
  editHref,
}: {
  postId: string;
  viewHref: string;
  editHref: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const shouldDelete = window.confirm("Бұл жазбаны жоюға сенімдісіз бе?");
    if (!shouldDelete) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      alert("Supabase орнатылмаған. .env.local тексеріңіз.");
      return;
    }

    setDeleting(true);

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    setDeleting(false);

    if (error) {
      alert(`Жою қатесі: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <Link
        href={viewHref}
        style={{
          color: "var(--color-primary)",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Ашу
      </Link>
      <Link
        href={editHref}
        style={{
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Өңдеу
      </Link>
      <button
        type="button"
        onClick={() => {
          void handleDelete();
        }}
        disabled={deleting}
        style={{
          border: "none",
          background: "transparent",
          color: "#b91c1c",
          fontWeight: 600,
          cursor: deleting ? "not-allowed" : "pointer",
          opacity: deleting ? 0.6 : 1,
          padding: 0,
          fontSize: 13,
        }}
      >
        {deleting ? "Жойылуда..." : "Жою"}
      </button>
    </div>
  );
}
