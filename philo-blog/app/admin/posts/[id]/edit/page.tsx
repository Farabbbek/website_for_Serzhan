import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostTypeForm } from "@/components/admin/PostTypeForm";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Жазбаны өңдеу | Admin Panel",
  description: "Жарияланған немесе жобадағы жазбаны өңдеу беті.",
};

type ContentType = "article" | "news" | "podcast" | "material";

function isContentType(value: string | null): value is ContentType {
  return value === "article" || value === "news" || value === "podcast" || value === "material";
}

function normalizeContentType(value: string | null): ContentType | null {
  if (value === "materials") return "material";
  return isContentType(value) ? value : null;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    notFound();
  }

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle<Database["public"]["Tables"]["posts"]["Row"]>();

  const normalizedType = normalizeContentType(post?.type ?? null);

  if (!post || !normalizedType) {
    notFound();
  }

  return <PostTypeForm type={normalizedType} initialPost={post} />;
}
