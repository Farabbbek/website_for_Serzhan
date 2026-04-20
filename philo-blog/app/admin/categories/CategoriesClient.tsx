"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Tag, AlertCircle } from "lucide-react";
import type { Database } from "@/lib/supabase/types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
  created_at: string;
}

type CategoriesClientProps = {
  initialCategories: Category[];
};

type CategoryQueryRow = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  created_at?: string | null;
  posts?: Array<{ count?: number | string | null }> | { count?: number | string | null } | null;
};

function extractErrorMessage(errorValue: unknown): string {
  if (typeof errorValue === "object" && errorValue !== null && "message" in errorValue) {
    const maybeMessage = (errorValue as { message?: unknown }).message;

    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  return "Белгісіз қате";
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return null;
    }

    return createBrowserClient<Database>(url, anonKey);
  }, []);

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  function toSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/--+/g, "-")
      .trim();
  }

  useEffect(() => {
    if (newName && !editingId) {
      setNewSlug(toSlug(newName));
    }
  }, [newName, editingId]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const fetchCategories = useCallback(async () => {
    if (!supabase) {
      setError("Supabase конфигі табылмады. .env.local тексеріңіз.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select(`
          *,
          posts(count)
        `)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const mapped: Category[] = ((data || []) as CategoryQueryRow[]).map((cat) => {
        const postsCount = Array.isArray(cat.posts)
          ? Number(cat.posts?.[0]?.count ?? 0)
          : Number(cat.posts?.count ?? 0);

        return {
          id: String(cat.id),
          name: String(cat.name ?? ""),
          slug: String(cat.slug ?? ""),
          description: cat.description ?? null,
          post_count: Number.isFinite(postsCount) ? postsCount : 0,
          created_at: String(cat.created_at ?? new Date().toISOString()),
        };
      });

      setCategories(mapped);
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  async function handleCreate() {
    if (!supabase) {
      setError("Supabase конфигі табылмады. .env.local тексеріңіз.");
      return;
    }

    if (!newName.trim()) return;

    setCreating(true);
    const slug = newSlug || toSlug(newName);
    const insertPayload = {
      name: newName.trim(),
      slug,
      description: newDesc.trim() || null,
    } as unknown as Database["public"]["Tables"]["categories"]["Insert"];

    const { error: createError } = await supabase.from("categories").insert([insertPayload]);

    if (createError) {
      alert("Қате: " + createError.message);
    } else {
      setShowCreate(false);
      setNewName("");
      setNewSlug("");
      setNewDesc("");
      await fetchCategories();
    }

    setCreating(false);
  }

  async function handleEditSave(id: string) {
    if (!supabase) {
      setError("Supabase конфигі табылмады. .env.local тексеріңіз.");
      return;
    }

    const updatePayload = {
      name: editName.trim(),
      description: editDesc.trim() || null,
    } as unknown as Database["public"]["Tables"]["categories"]["Update"];

    const { error: updateError } = await supabase
      .from("categories")
      .update(updatePayload)
      .eq("id", id);

    if (updateError) {
      alert("Қате: " + updateError.message);
    } else {
      setEditingId(null);
      await fetchCategories();
    }
  }

  async function handleDelete(id: string) {
    if (!supabase) {
      setError("Supabase конфигі табылмады. .env.local тексеріңіз.");
      return;
    }

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert("Жою мүмкін емес: " + deleteError.message);
    } else {
      setDeletingId(null);
      await fetchCategories();
    }
  }

  return (
    <section style={{ width: "100%" }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .category-modal-input:focus,
        .category-modal-textarea:focus,
        .category-edit-input:focus,
        .category-edit-textarea:focus {
          border-color: var(--color-primary) !important;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 32,
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            Категориялар
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginTop: 4 }}>
            {categories.length} категория табылды
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            background: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
          Жаңа категория
        </button>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 20px",
            background: "rgba(197,64,26,0.08)",
            border: "1px solid rgba(197,64,26,0.2)",
            borderRadius: 10,
            color: "var(--color-primary)",
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          <AlertCircle size={18} />
          {error}
          <button
            onClick={() => void fetchCategories()}
            style={{
              marginLeft: "auto",
              fontSize: 12,
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-primary)",
            }}
          >
            Қайта жүктеу
          </button>
        </div>
      )}

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 140,
                borderRadius: 12,
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 32px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
          }}
        >
          <Tag size={36} style={{ color: "var(--color-text-faint)", margin: "0 auto 16px" }} />
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--color-text)",
              marginBottom: 8,
            }}
          >
            Категориялар жоқ
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--color-text-muted)",
              maxWidth: 300,
              margin: "0 auto 20px",
            }}
          >
            Мақала жасаған кезде автоматты қосылады немесе мануал жасаңыз
          </p>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "9px 20px",
              background: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Категория жасау
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {categories.map((cat) =>
            editingId === cat.id ? (
              <div
                key={cat.id}
                style={{
                  padding: "20px",
                  background: "var(--color-surface)",
                  border: "2px solid var(--color-primary)",
                  borderRadius: 12,
                  minWidth: 0,
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.08em",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    АТЫ
                  </label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    className="category-edit-input"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--color-border)",
                      borderRadius: 7,
                      fontSize: 14,
                      background: "var(--color-bg)",
                      color: "var(--color-text)",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.08em",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    СИПАТТАМА
                  </label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={2}
                    className="category-edit-textarea"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--color-border)",
                      borderRadius: 7,
                      fontSize: 13,
                      resize: "vertical",
                      background: "var(--color-bg)",
                      color: "var(--color-text)",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => void handleEditSave(cat.id)}
                    disabled={!editName.trim()}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      background: !editName.trim() ? "var(--color-surface-offset)" : "var(--color-primary)",
                      color: !editName.trim() ? "var(--color-text-muted)" : "white",
                      border: "none",
                      borderRadius: 7,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: !editName.trim() ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Check size={14} /> Сақтау
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      padding: "8px 16px",
                      background: "var(--color-surface-2)",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 7,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <X size={14} /> Болдырмау
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={cat.id}
                style={{
                  padding: "20px 20px 16px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  position: "relative",
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {cat.slug}
                  </span>

                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditName(cat.name);
                        setEditDesc(cat.description || "");
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface-2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "var(--color-text-muted)",
                      }}
                      aria-label="Категорияны өңдеу"
                    >
                      <Pencil size={13} />
                    </button>

                    {deletingId === cat.id ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => void handleDelete(cat.id)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Жою
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: "1px solid var(--color-border)",
                            background: "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--color-text-muted)",
                          }}
                          aria-label="Жоюды болдырмау"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(cat.id)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: "1px solid var(--color-border)",
                          background: "var(--color-surface-2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "var(--color-text-muted)",
                        }}
                        aria-label="Категорияны жою"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: 22,
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: 6,
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={cat.name}
                >
                  {cat.name}
                </h3>

                {cat.description && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                      lineHeight: 1.5,
                      marginBottom: 12,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {cat.description}
                  </p>
                )}

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 12,
                    borderTop: "1px solid var(--color-border)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {cat.post_count} МАҚАЛА
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {showCreate && (
        <>
          <div
            onClick={() => setShowCreate(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(480px, 90vw)",
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: 16,
              padding: 28,
              zIndex: 101,
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-text)",
                  fontFamily: "var(--font-display)",
                  margin: 0,
                }}
              >
                Жаңа категория
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                }}
                aria-label="Жабу"
              >
                <X size={16} />
              </button>
            </div>

            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                display: "block",
                marginBottom: 5,
              }}
            >
              АТЫ*
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              className="category-modal-input"
              type="text"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 14,
                background: "var(--color-surface)",
                color: "var(--color-text)",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                marginBottom: 16,
              }}
            />

            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                display: "block",
                marginBottom: 5,
              }}
            >
              SLUG
            </label>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(toSlug(e.target.value))}
              className="category-modal-input"
              type="text"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 14,
                background: "var(--color-surface)",
                color: "var(--color-text)",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                marginBottom: 6,
              }}
            />
            <p
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                margin: "0 0 16px",
              }}
            >
              Автоматты толтырылады
            </p>

            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                display: "block",
                marginBottom: 5,
              }}
            >
              СИПАТТАМА
            </label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="category-modal-textarea"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 14,
                background: "var(--color-surface)",
                color: "var(--color-text)",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                marginBottom: 16,
                resize: "vertical",
              }}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                onClick={() => void handleCreate()}
                disabled={creating || !newName.trim()}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background:
                    creating || !newName.trim()
                      ? "var(--color-surface-offset)"
                      : "var(--color-primary)",
                  color:
                    creating || !newName.trim()
                      ? "var(--color-text-muted)"
                      : "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor:
                    creating || !newName.trim() ? "not-allowed" : "pointer",
                }}
              >
                {creating ? "Жасалуда..." : "Жасау"}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  padding: "11px 20px",
                  background: "var(--color-surface)",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Болдырмау
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
