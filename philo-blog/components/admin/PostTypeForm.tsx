"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  FileText,
  Mic2,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type ContentType = "article" | "news" | "podcast" | "material";
type PostStatus = "draft" | "published";
type Level = "all" | "bachelor" | "master" | "phd";
type MaterialType = "pdf" | "link" | "video" | "book" | "lecture";
type StoredMaterialResource = { label: string; url: string };
type MaterialResourceDraft = StoredMaterialResource & { id: string; file: File | null };
type Category = Pick<Database["public"]["Tables"]["categories"]["Row"], "id" | "name" | "slug">;
type EditablePost = Database["public"]["Tables"]["posts"]["Row"];

type ContentConfig = {
  type: ContentType;
  accent: string;
  badge: string;
  title: string;
  icon: LucideIcon;
};

type ArticleExtractionResponse = {
  ok?: boolean;
  text?: string;
  message?: string;
  code?: string;
};

type SocialPreviewResponse = {
  ok?: boolean;
  imageUrl?: string;
  message?: string;
};

const configs: Record<ContentType, ContentConfig> = {
  article: {
    type: "article",
    accent: "#C5401A",
    badge: "МАҚАЛА",
    title: "Жаңа мақала",
    icon: FileText,
  },
  news: {
    type: "news",
    accent: "#2563eb",
    badge: "ЖАҢАЛЫҚ",
    title: "Жаңа жаңалық",
    icon: Newspaper,
  },
  podcast: {
    type: "podcast",
    accent: "#7c3aed",
    badge: "ПОДКАСТ",
    title: "Жаңа подкаст",
    icon: Mic2,
  },
  material: {
    type: "material",
    accent: "#059669",
    badge: "МАТЕРИАЛ",
    title: "Жаңа материал",
    icon: BookOpen,
  },
};

const fieldClass =
  "w-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-[14px] text-[color:var(--color-text)] outline-none transition-colors focus:border-[color:var(--color-primary)]";

const labelClass =
  "flex flex-col gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]";

const MATERIAL_TYPE_CANDIDATES = ["material", "materials"] as const;

function isPostsTypeCheckError(message: string | undefined): boolean {
  if (!message) return false;
  return message.toLowerCase().includes("posts_type_check");
}

function extractYouTubeVideoId(rawUrl: string): string | null {
  if (!rawUrl.trim()) return null;

  try {
    const parsed = new URL(rawUrl.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const watchId = parsed.searchParams.get("v")?.trim();
      if (watchId) return watchId;

      const pathParts = parsed.pathname.split("/").filter(Boolean);
      const markerIndex = pathParts.findIndex((part) =>
        part === "embed" || part === "shorts" || part === "live",
      );

      if (markerIndex >= 0 && pathParts[markerIndex + 1]) {
        return pathParts[markerIndex + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function normalizeInstagramPostUrl(rawUrl: string): string | null {
  if (!rawUrl.trim()) return null;

  try {
    const parsed = new URL(rawUrl.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (
      host !== "instagram.com" &&
      host !== "m.instagram.com" &&
      host !== "instagr.am"
    ) {
      return null;
    }

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) return null;

    const marker = pathParts[0]?.toLowerCase();
    const shortcode = pathParts[1]?.trim();

    if (!shortcode) return null;
    if (marker !== "reel" && marker !== "p" && marker !== "tv") return null;

    return `https://www.instagram.com/${marker}/${shortcode}/`;
  } catch {
    return null;
  }
}

function buildInstagramProxyCoverUrl(instagramPostUrl: string): string {
  return `/api/social/preview?mode=image&url=${encodeURIComponent(instagramPostUrl)}`;
}

function generateSlug(text: string): string {
  const transliterationMap: Record<string, string> = {
    а: "a",
    ә: "a",
    б: "b",
    в: "v",
    г: "g",
    ғ: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "i",
    к: "k",
    қ: "k",
    л: "l",
    м: "m",
    н: "n",
    ң: "n",
    о: "o",
    ө: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ұ: "u",
    ү: "u",
    ф: "f",
    х: "h",
    һ: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    і: "i",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  const transliterated = text
    .toLowerCase()
    .split("")
    .map((char) => transliterationMap[char] ?? char)
    .join("");

  return transliterated
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createMaterialResourceDraft(resource?: Partial<StoredMaterialResource>): MaterialResourceDraft {
  const id =
    typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    id,
    label: resource?.label?.trim() ?? "",
    url: resource?.url?.trim() ?? "",
    file: null,
  };
}

function parseStoredMaterialResources(rawValue: string): StoredMaterialResource[] {
  if (!rawValue.trim()) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const resource = item as Partial<StoredMaterialResource>;
        const label = typeof resource.label === "string" ? resource.label.trim() : "";
        const url = typeof resource.url === "string" ? resource.url.trim() : "";

        if (!url) return null;

        return {
          label,
          url,
        };
      })
      .filter((item): item is StoredMaterialResource => item !== null);
  } catch {
    return [];
  }
}

function parseStoredContent(contentValue: string) {
  const parsed = {
    body: contentValue,
    eventDate: "",
    season: "",
    episode: "",
    language: "",
    author: "",
    year: "",
    subject: "",
    materialType: "" as string,
    materialResources: [] as StoredMaterialResource[],
  };

  if (!contentValue) return parsed;

  const lines = contentValue.split("\n");
  const bodyLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      bodyLines.push(line);
      continue;
    }

    const eventDateMatch = trimmed.match(/^Оқиға күні:\s*(.+)$/);
    if (eventDateMatch) {
      parsed.eventDate = eventDateMatch[1];
      continue;
    }

    const seasonMatch = trimmed.match(/^Сезон:\s*(.+)$/);
    if (seasonMatch) {
      parsed.season = seasonMatch[1];
      continue;
    }

    const episodeMatch = trimmed.match(/^Эпизод:\s*(.+)$/);
    if (episodeMatch) {
      parsed.episode = episodeMatch[1];
      continue;
    }

    const languageMatch = trimmed.match(/^Тіл:\s*(.+)$/);
    if (languageMatch) {
      parsed.language = languageMatch[1];
      continue;
    }

    const authorMatch = trimmed.match(/^Автор:\s*(.+)$/);
    if (authorMatch) {
      parsed.author = authorMatch[1];
      continue;
    }

    const yearMatch = trimmed.match(/^Жылы:\s*(.+)$/);
    if (yearMatch) {
      parsed.year = yearMatch[1];
      continue;
    }

    const subjectMatch = trimmed.match(/^Пән:\s*(.+)$/);
    if (subjectMatch) {
      parsed.subject = subjectMatch[1];
      continue;
    }

    const materialTypeMatch = trimmed.match(/^Түрі:\s*(.+)$/);
    if (materialTypeMatch) {
      parsed.materialType = materialTypeMatch[1];
      continue;
    }

    const resourcesMatch = trimmed.match(/^РесурстарJSON:\s*(.+)$/);
    if (resourcesMatch) {
      parsed.materialResources = parseStoredMaterialResources(resourcesMatch[1]);
      continue;
    }

    bodyLines.push(line);
  }

  parsed.body = bodyLines.join("\n").trim();
  return parsed;
}

function getArticleContentMetrics(rawContent: string) {
  const normalized = rawContent.replace(/\r\n/g, "\n").trim();
  const characterCount = normalized.length;
  const wordCount = normalized
    ? normalized.split(/\s+/).filter(Boolean).length
    : 0;

  const paragraphs = normalized
    ? normalized
        .split(/\n\s*\n/g)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  const headingCount = normalized
    ? normalized
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => /^#{2,3}\s+/.test(line)).length
    : 0;

  const hasOverlongParagraph = paragraphs.some(
    (paragraph) => paragraph.replace(/\s+/g, " ").length > 700,
  );

  return {
    characterCount,
    wordCount,
    paragraphCount: paragraphs.length,
    headingCount,
    hasOverlongParagraph,
  };
}

function getArticleWarnings(rawContent: string): string[] {
  const metrics = getArticleContentMetrics(rawContent);
  const warnings: string[] = [];

  if (metrics.hasOverlongParagraph) {
    warnings.push(
      "Кейбір абзацтар өте ұзын. Жақсы оқылуы үшін оларды екіге бөліңіз.",
    );
  }

  if (metrics.characterCount > 18000) {
    warnings.push("Мәтін өте ұзын. Қажет болса, мақаланы бірнеше бөлікке бөліңіз.");
  }

  if (metrics.characterCount >= 2000 && metrics.headingCount === 0) {
    warnings.push(
      "Ұзын мәтінге бөлім тақырыптарын (##) қоссаңыз, оқуға жеңілірек болады.",
    );
  }

  return warnings;
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5">
      <div
        className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]"
        style={{ fontFamily: "var(--font-ui)", lineHeight: 1.2 }}
      >
        {title}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function StatusPills({
  status,
  setStatus,
  accent,
}: {
  status: PostStatus;
  setStatus: (status: PostStatus) => void;
  accent: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        ["draft", "Жоба"],
        ["published", "Жарияланған"],
      ].map(([value, label]) => {
        const active = status === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value as PostStatus)}
            className="rounded-[8px] border px-3 py-2 text-[13px] transition-colors"
            style={{
              borderColor: active ? accent : "var(--color-border)",
              background: active ? `${accent}15` : "transparent",
              color: active ? accent : "var(--color-text-muted)",
              fontWeight: active ? 600 : 500,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function CoverPanel({
  title,
  coverImage,
  coverPreview,
  coverFile,
  setCoverImage,
  setCoverFile,
  setCoverPreview,
  placeholder,
  helperText,
  uploadOnly,
}: {
  title: string;
  coverImage: string;
  coverPreview: string;
  coverFile: File | null;
  setCoverImage: (value: string) => void;
  setCoverFile: (file: File | null) => void;
  setCoverPreview: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  uploadOnly?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputId = "cover-panel-upload";
  const previewSource = coverFile && coverPreview ? coverPreview : coverImage;

  function applySelectedFile(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Тек сурет файлын таңдаңыз (JPG, PNG, WEBP)");
      return;
    }

    setCoverFile(file);
  }

  return (
    <Panel title={title}>
      {uploadOnly ? (
        <>
          <div
            onClick={() => document.getElementById(inputId)?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const file = event.dataTransfer.files?.[0] ?? null;
              applySelectedFile(file);
            }}
            style={{
              position: "relative",
              aspectRatio: "16/9",
              borderRadius: 10,
              overflow: "hidden",
              border: `2px dashed ${isDragging ? "var(--color-primary)" : "var(--color-border)"}`,
              background: previewSource ? "transparent" : "var(--color-surface-offset)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 180ms",
            }}
          >
            {previewSource ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSource} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.36)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 600,
                    opacity: 0,
                    transition: "opacity 160ms",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                >
                  Drag & Drop / Өзгерту
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: 16 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🖼</div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    fontWeight: 700,
                    marginBottom: 4,
                    letterSpacing: "0.03em",
                  }}
                >
                  Drag & Drop сурет
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-faint)" }}>
                  немесе Файл таңдау батырмасын басыңыз
                </div>
              </div>
            )}
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={(event) => {
                applySelectedFile(event.target.files?.[0] ?? null);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 2,
            }}
          >
            <button
              type="button"
              onClick={() => document.getElementById(inputId)?.click()}
              className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-2 text-[12px] font-semibold text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            >
              Файл таңдау
            </button>
            {coverFile || coverImage ? (
              <button
                type="button"
                onClick={() => {
                  setCoverFile(null);
                  setCoverPreview("");
                  setCoverImage("");
                }}
                className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-2 text-[12px] font-semibold text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-error)] hover:text-[color:var(--color-error)]"
              >
                Жою
              </button>
            ) : null}
          </div>
          {helperText ? (
            <div style={{ marginTop: 2, fontSize: 11, color: "var(--color-text-faint)" }}>{helperText}</div>
          ) : null}
        </>
      ) : (
        <>
          <label className={labelClass}>
            URL
            <input
              type="url"
              value={coverImage}
              onChange={(event) => setCoverImage(event.target.value)}
              placeholder={placeholder ?? "https://..."}
              className={fieldClass}
              style={{ borderRadius: "8px" }}
            />
          </label>
          {helperText ? (
            <div style={{ marginTop: -8, fontSize: 11, color: "var(--color-text-faint)" }}>{helperText}</div>
          ) : null}
          {coverImage ? (
            <div className="overflow-hidden rounded-[10px] border border-[color:var(--color-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="" className="aspect-video w-full object-cover" />
            </div>
          ) : null}
        </>
      )}
    </Panel>
  );
}

export function PostTypeForm({
  type,
  initialPost,
}: {
  type: ContentType;
  initialPost?: EditablePost | null;
}) {
  const router = useRouter();
  const config = configs[type];
  const Icon = config.icon;
  const isEditing = Boolean(initialPost?.id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<PostStatus>("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [sourceUrl, setSourceUrl] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [extractingArticleText, setExtractingArticleText] = useState(false);
  const [extractArticleMessage, setExtractArticleMessage] = useState<{
    tone: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [duration, setDuration] = useState("");
  const [guests, setGuests] = useState("");
  const [podcastCoverHint, setPodcastCoverHint] = useState<string | null>(null);
  const [language, setLanguage] = useState("Қазақша");
  const [materialType, setMaterialType] = useState<MaterialType>("pdf");
  const [fileUrl, setFileUrl] = useState("");
  const [materialResources, setMaterialResources] = useState<MaterialResourceDraft[]>([
    createMaterialResourceDraft(),
  ]);
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [level, setLevel] = useState<Level>("all");
  const [subject, setSubject] = useState("");
  const podcastCoverRequestRef = useRef(0);

  useEffect(() => {
    setSlug(generateSlug(title));
  }, [title]);

  useEffect(() => {
    if (!initialPost) return;

    const parsedContent = parseStoredContent(initialPost.content ?? "");

    setTitle(initialPost.title ?? "");
    setSlug(generateSlug(initialPost.title ?? ""));
    setAuthorName(initialPost.author_name ?? "");
    setExcerpt(initialPost.excerpt ?? "");
    setContent(parsedContent.body ?? "");
    setCoverImage(initialPost.cover_url ?? "");
    setCoverPreview(initialPost.cover_url ?? "");
    setCategoryId(initialPost.category_id ?? "");
    setStatus(initialPost.status === "published" ? "published" : "draft");
    setSourceUrl(initialPost.source_url ?? "");
    setAudioUrl(initialPost.audio_url ?? "");
    setDuration(initialPost.duration ?? "");
    setGuests(initialPost.guests ?? "");
    setFileUrl(initialPost.file_url ?? "");
    setLevel(
      initialPost.level === "bachelor" ||
      initialPost.level === "master" ||
      initialPost.level === "phd"
        ? initialPost.level
        : "all",
    );

    if (parsedContent.eventDate) setEventDate(parsedContent.eventDate);
    if (parsedContent.language) setLanguage(parsedContent.language);
    if (parsedContent.author) setAuthor(parsedContent.author);
    if (parsedContent.year) setYear(parsedContent.year);
    if (parsedContent.subject) setSubject(parsedContent.subject);

    if (
      parsedContent.materialType === "pdf" ||
      parsedContent.materialType === "link" ||
      parsedContent.materialType === "video" ||
      parsedContent.materialType === "book" ||
      parsedContent.materialType === "lecture"
    ) {
      setMaterialType(parsedContent.materialType);
    }

    if (type === "material") {
      if (parsedContent.materialResources.length > 0) {
        setMaterialResources(
          parsedContent.materialResources.map((resource) => createMaterialResourceDraft(resource)),
        );
      } else if (initialPost.file_url) {
        setMaterialResources([
          createMaterialResourceDraft({
            label: "Негізгі материал",
            url: initialPost.file_url,
          }),
        ]);
      }
    }
  }, [initialPost, type]);

  useEffect(() => {
    if (!coverFile) return;
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const client = supabase;

    let active = true;

    async function loadCategories() {
      const scoped = await client
        .from("categories")
        .select("id,name,slug")
        .or(`type.eq.${type},type.is.null`)
        .order("name", { ascending: true });

      const result = scoped.error
        ? await client
            .from("categories")
            .select("id,name,slug")
            .order("name", { ascending: true })
        : scoped;

      if (active) {
        setCategories((result.data as Category[] | null) ?? []);
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, [type]);

  const autoArticleCategoryId = useMemo(() => {
    if (type !== "article") return "";

    const matched = categories.find(
      (category) =>
        /мақал|maqal/i.test(category.name) ||
        category.slug === "maqalalar" ||
        category.slug === "maqala",
    );

    return matched?.id ?? categories[0]?.id ?? "";
  }, [categories, type]);

  const articleMetrics = useMemo(() => getArticleContentMetrics(content), [content]);

  useEffect(() => {
    if (type === "article" && autoArticleCategoryId) {
      setCategoryId(autoArticleCategoryId);
    }
  }, [autoArticleCategoryId, type]);

  // SETUP: In Supabase Dashboard → Storage → New bucket
  // Name: "media", Public: true
  // Add policy: allow authenticated users to upload
  async function uploadToMedia(file: File, folder: string): Promise<string> {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Авторизация қажет");
    }

    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${user.id}/${Date.now()}.${ext}`;

    setUploading(true);
    setUploadProgress("Жүктелуде...");

    try {
      const { error } = await supabase.storage
        .from("media")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) {
        throw new Error(error.message);
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);
      return urlData.publicUrl;
    } finally {
      setUploadProgress("");
      setUploading(false);
    }
  }

  async function uploadAudio(file: File): Promise<string> {
    return uploadToMedia(file, "podcasts");
  }

  async function uploadArticleFile(file: File): Promise<string> {
    return uploadToMedia(file, "articles");
  }

  async function uploadMaterialFile(file: File): Promise<string> {
    return uploadToMedia(file, "materials");
  }

  async function fetchInstagramCoverFromUrl(rawUrl: string): Promise<string | null> {
    const normalizedInstagramUrl = normalizeInstagramPostUrl(rawUrl);
    if (!normalizedInstagramUrl) return null;

    try {
      const response = await fetch(
        `/api/social/preview?url=${encodeURIComponent(normalizedInstagramUrl)}`,
      );

      if (!response.ok) return null;

      const result = (await response.json()) as SocialPreviewResponse;
      const imageUrl = result.imageUrl?.trim() ?? "";

      if (!imageUrl) return null;
      return buildInstagramProxyCoverUrl(normalizedInstagramUrl);
    } catch {
      return null;
    }
  }

  const syncPodcastCoverFromAudioUrl = useCallback(async (nextUrl: string) => {
    if (type !== "podcast") return;

    const trimmedUrl = nextUrl.trim();
    if (!trimmedUrl) {
      setPodcastCoverHint(null);
      return;
    }

    const videoId = extractYouTubeVideoId(trimmedUrl);

    if (videoId) {
      setCoverImage(getYouTubeThumbnailUrl(videoId));
      setPodcastCoverHint("YouTube обложкасы автоматты қойылды.");
      return;
    }

    const normalizedInstagramUrl = normalizeInstagramPostUrl(trimmedUrl);
    if (!normalizedInstagramUrl) {
      setPodcastCoverHint(null);
      return;
    }

    const requestId = ++podcastCoverRequestRef.current;
    const instagramCover = await fetchInstagramCoverFromUrl(normalizedInstagramUrl);

    if (requestId !== podcastCoverRequestRef.current) {
      return;
    }

    if (!instagramCover) {
      setPodcastCoverHint(
        "Instagram обложкасы автоматты алынбады. Қажет болса, мұқабаны қолмен жүктеңіз.",
      );
      return;
    }

    setCoverImage(instagramCover);
    setPodcastCoverHint("Instagram обложкасы автоматты қойылды.");
  }, [type]);

  useEffect(() => {
    if (type !== "podcast" || coverFile || coverImage || !audioUrl.trim()) return;

    void syncPodcastCoverFromAudioUrl(audioUrl);
  }, [type, audioUrl, coverFile, coverImage, syncPodcastCoverFromAudioUrl]);

  async function handleExtractArticleText() {
    if (!articleFile) {
      alert("Алдымен DOCX немесе PDF файл таңдаңыз");
      return;
    }

    if (content.trim()) {
      const shouldOverwrite = window.confirm(
        "Textarea ішінде мәтін бар. Оны файлдан шыққан мәтінмен алмастырайық па?",
      );

      if (!shouldOverwrite) {
        return;
      }
    }

    setExtractingArticleText(true);
    setExtractArticleMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", articleFile);

      const response = await fetch("/api/articles/extract", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as ArticleExtractionResponse;

      if (!response.ok) {
        throw new Error(result.message || "Мәтінді шығару сәтсіз аяқталды");
      }

      if (result.ok && result.text) {
        setContent(result.text);
        setExtractArticleMessage({
          tone: "success",
          text: "Мәтін файлдан толтырылды. Жариялар алдында тексеріңіз.",
        });
        return;
      }

      setExtractArticleMessage({
        tone: result.code === "UNSUPPORTED_PDF" ? "info" : "error",
        text:
          result.message ||
          "Мәтінді автоматты шығару мүмкін болмады. Қолмен өңдеуді жалғастырыңыз.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Белгісіз қате";
      setExtractArticleMessage({
        tone: "error",
        text: `Мәтінді шығару сәтсіз аяқталды: ${message}`,
      });
    } finally {
      setExtractingArticleText(false);
    }
  }

  async function handleSave(nextStatus: PostStatus) {
    if (!title.trim()) {
      alert("Тақырып міндетті");
      return;
    }

    if (type === "news" && !content.trim()) {
      alert("Мәтін міндетті");
      return;
    }

    if (
      type === "article" &&
      nextStatus === "published" &&
      content.trim().length < 1200
    ) {
      alert("Мақала мәтіні тым қысқа. Кемінде 1200 символ керек.");
      return;
    }

    if (type === "article" && !articleFile && !fileUrl.trim() && !content.trim()) {
      alert("Мақала файлын жүктеу немесе мәтін енгізу міндетті");
      return;
    }

    if (type === "article") {
      const warnings = getArticleWarnings(content);
      if (warnings.length) {
        alert(warnings.join("\n"));
      }
    }

    if (type === "podcast" && !audioUrl.trim() && !audioFile) {
      alert("Аудио файл немесе сілтеме міндетті");
      return;
    }

    if (
      type === "material" &&
      materialType !== "lecture" &&
      !materialResources.some((resource) => resource.file || resource.url.trim())
    ) {
      alert("Кемінде бір файл немесе сілтеме қосыңыз");
      return;
    }

    if (type === "material" && materialType === "lecture" && !content.trim()) {
      alert("Дәріс мазмұны міндетті");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      alert("Supabase орнатылмаған. .env.local тексеріңіз.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let coverUrl = coverImage || null;

    if (coverFile) {
      const storageClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const {
        data: { user: storageUser },
      } = await storageClient.auth.getUser();

      const ext = coverFile.name.split(".").pop();
      const path = `covers/${storageUser?.id ?? "anon"}/${Date.now()}.${ext}`;

      const { error: upErr } = await storageClient.storage
        .from("media")
        .upload(path, coverFile, { upsert: false });

      if (upErr) {
        alert(`Обложка жүктеу қатесі: ${upErr.message}`);
        setLoading(false);
        return;
      }

      coverUrl = storageClient.storage.from("media").getPublicUrl(path).data.publicUrl;
    }

    const resolvedMaterialResources: StoredMaterialResource[] = [];

    if (type === "material") {
      for (const resource of materialResources) {
        const trimmedLabel = resource.label.trim();

        if (resource.file) {
          try {
            const uploadedUrl = await uploadMaterialFile(resource.file);
            resolvedMaterialResources.push({
              label: trimmedLabel || resource.file.name,
              url: uploadedUrl,
            });
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Белгісіз қате";
            alert(`Материал файлын жүктеу қатесі: ${message}`);
            setLoading(false);
            return;
          }
          continue;
        }

        const trimmedUrl = resource.url.trim();
        if (!trimmedUrl) continue;

        resolvedMaterialResources.push({
          label: trimmedLabel || `Материал ${resolvedMaterialResources.length + 1}`,
          url: trimmedUrl,
        });
      }

      if (materialType !== "lecture" && resolvedMaterialResources.length === 0) {
        alert("Кемінде бір файл немесе сілтеме қосыңыз");
        setLoading(false);
        return;
      }
    }

    const metadata = [
      type === "news" && eventDate ? `Оқиға күні: ${eventDate}` : "",
      type === "podcast" && language ? `Тіл: ${language}` : "",
      type === "material" && author ? `Автор: ${author}` : "",
      type === "material" && year ? `Жылы: ${year}` : "",
      type === "material" && subject ? `Пән: ${subject}` : "",
      type === "material" && materialType ? `Түрі: ${materialType}` : "",
      type === "material" && resolvedMaterialResources.length
        ? `РесурстарJSON: ${JSON.stringify(resolvedMaterialResources)}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const bodyContent = [content.trim(), metadata].filter(Boolean).join("\n\n");

    const generatedSlug = generateSlug(title);
    const baseSlug = generatedSlug || `post-${Date.now()}`;
    let uniqueSlug = baseSlug;
    let suffix = 2;

    while (true) {
      const { data: existingPost } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", uniqueSlug)
        .maybeSingle();

      if (!existingPost || existingPost.id === initialPost?.id) {
        break;
      }

      uniqueSlug = `${baseSlug}-${suffix}`;
      suffix += 1;

      if (suffix > 50) {
        uniqueSlug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    setSlug(uniqueSlug);

    const payload: Database["public"]["Tables"]["posts"]["Update"] = {
      title: title.trim(),
      slug: uniqueSlug,
      excerpt: excerpt || null,
      content: type === "article" ? content.trim() : bodyContent || excerpt || "",
      cover_url: coverUrl,
      category_id: type === "article" ? autoArticleCategoryId || null : categoryId || null,
      status: nextStatus,
      type,
      author_name: type === "article" ? authorName.trim() || null : null,
      author_id: initialPost?.author_id ?? user?.id ?? null,
      published_at:
        nextStatus === "published"
          ? initialPost?.published_at ?? new Date().toISOString()
          : null,
      source_url: type === "news" || type === "article" ? sourceUrl || null : null,
      audio_url: type === "podcast" ? audioUrl || null : null,
      duration: type === "podcast" ? duration || null : null,
      guests: type === "podcast" ? guests || null : null,
      file_url:
        type === "material"
          ? resolvedMaterialResources[0]?.url ?? null
          : type === "article"
            ? fileUrl || null
            : null,
      level: type === "material" ? level : "all",
    };

    if (type === "article" && articleFile) {
      try {
        const url = await uploadArticleFile(articleFile);
        payload.file_url = url;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Белгісіз қате";
        alert(`Мақала файлын жүктеу қатесі: ${message}`);
        setLoading(false);
        return;
      }
    }

    if (audioFile) {
      try {
        const url = await uploadAudio(audioFile);
        payload.audio_url = url;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Белгісіз қате";
        alert(`Аудио жүктеу қатесі: ${message}`);
        setLoading(false);
        return;
      }
    }

    const persistWithType = async (typeValue: string) => {
      const nextPayload = { ...payload, type: typeValue };

      return isEditing
        ? await supabase.from("posts").update(nextPayload).eq("id", initialPost!.id)
        : await supabase
            .from("posts")
            .insert([nextPayload as Database["public"]["Tables"]["posts"]["Insert"]]);
    };

    let error: { message: string } | null = null;

    if (type === "material") {
      for (const candidateType of MATERIAL_TYPE_CANDIDATES) {
        const { error: candidateError } = await persistWithType(candidateType);

        if (!candidateError) {
          error = null;
          break;
        }

        error = candidateError;

        if (!isPostsTypeCheckError(candidateError.message)) {
          break;
        }
      }
    } else {
      const { error: candidateError } = await persistWithType(type);
      error = candidateError;
    }

    if (error) {
      alert(`Қате: ${error.message}`);
      setLoading(false);
      return;
    }

    router.push("/admin/posts");
  }

  return (
    <section className="flex w-full max-w-none flex-col gap-6">
      <header className="flex flex-col gap-4">
        <Link
          href="/admin/posts/new"
          className="w-fit text-[13px] font-medium text-[color:var(--color-text-muted)] no-underline transition-colors hover:text-[color:var(--color-primary)]"
        >
          ← Артқа
        </Link>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{ background: `${config.accent}15`, color: config.accent }}
          >
            <Icon size={14} />
            {config.badge}
          </span>
          <h1 className="font-display text-[30px] font-bold text-[color:var(--color-text)]">
            {isEditing ? config.title.replace("Жаңа", "Өңдеу") : config.title}
          </h1>
        </div>
      </header>

      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSave(type === "article" ? "published" : status);
        }}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-5">
            <label className={labelClass}>
              Тақырып*
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={type === "podcast" ? "Эпизод атауы..." : type === "material" ? "Материал атауы..." : "Тақырып..."}
                className={fieldClass}
                style={{ borderRadius: "8px" }}
              />
            </label>

            {type === "article" ? (
              <div style={{ marginBottom: 20 }}>
                <label className={labelClass}>АВТОР АТЫ</label>
                <input
                  type="text"
                  placeholder="Авторды жазыңыз..."
                  value={authorName}
                  onChange={(event) => setAuthorName(event.target.value)}
                  className={fieldClass}
                  style={{ borderRadius: "8px" }}
                />
                <div style={{ fontSize: 11, color: "var(--color-text-faint)", marginTop: 4 }}>
                  Егер бос қалса, профиль атыңыз қолданылады
                </div>
              </div>
            ) : null}

            <label className={labelClass}>
              Slug (автоматты)
              <input
                type="text"
                value={slug}
                readOnly
                className={`${fieldClass} font-mono`}
                style={{ borderRadius: "8px", opacity: 0.9 }}
              />
            </label>

            {type === "article" ? (
              <>
                <label className={labelClass}>
                  Қысқаша сипаттама
                  <textarea
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value.slice(0, 500))}
                    rows={3}
                    maxLength={500}
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                  <span className="self-end text-[11px] text-[color:var(--color-text-faint)]">
                    {excerpt.length}/500
                  </span>
                </label>

                <div style={{ marginBottom: 20 }}>
                  <label className={labelClass}>МАҚАЛА МӘТІНІ</label>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-faint)",
                      marginBottom: 4,
                    }}
                  >
                    Мәтінді осында жазыңыз. Бос жол жаңа абзац жасайды.
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-faint)",
                      marginBottom: 10,
                    }}
                  >
                    Жеңіл разметка: &apos;##&apos; — бөлім тақырыбы, &apos;###&apos; — кіші
                    тақырып, &apos;-&apos; — тізім, &apos;&gt;&apos; — дәйексөз.
                  </div>
                  <textarea
                    placeholder={"Мақала мәтінін осында жазыңыз...\n\nКіріспе бөлімінен бастаңыз."}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={20}
                    className={fieldClass}
                    style={{
                      borderRadius: "12px",
                      resize: "vertical",
                      lineHeight: 1.8,
                      fontSize: 15,
                      fontFamily: "var(--font-body)",
                      minHeight: 520,
                      padding: "16px",
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: 11,
                        color: "var(--color-text-faint)",
                        background: "var(--color-surface)",
                      }}
                    >
                      <strong style={{ color: "var(--color-text-muted)", marginRight: 6 }}>
                        Символ:
                      </strong>
                      {articleMetrics.characterCount}
                    </div>
                    <div
                      style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: 11,
                        color: "var(--color-text-faint)",
                        background: "var(--color-surface)",
                      }}
                    >
                      <strong style={{ color: "var(--color-text-muted)", marginRight: 6 }}>
                        Сөз:
                      </strong>
                      {articleMetrics.wordCount}
                    </div>
                    <div
                      style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: 11,
                        color: "var(--color-text-faint)",
                        background: "var(--color-surface)",
                      }}
                    >
                      <strong style={{ color: "var(--color-text-muted)", marginRight: 6 }}>
                        Абзац:
                      </strong>
                      {articleMetrics.paragraphCount}
                    </div>
                    <div
                      style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: 11,
                        color: "var(--color-text-faint)",
                        background: "var(--color-surface)",
                      }}
                    >
                      <strong style={{ color: "var(--color-text-muted)", marginRight: 6 }}>
                        Тақырып:
                      </strong>
                      {articleMetrics.headingCount}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className={labelClass}>МАҚАЛА ФАЙЛЫ* (PDF немесе DOCX)</label>

                  <div
                    style={{
                      border: "2px dashed var(--color-border)",
                      borderRadius: 10,
                      padding: "20px",
                      textAlign: "center",
                      marginBottom: 10,
                      background: articleFile ? "rgba(197,64,26,0.04)" : "var(--color-surface)",
                      cursor: "pointer",
                      transition: "border-color 180ms",
                    }}
                    onClick={() => document.getElementById("article-upload")?.click()}
                  >
                    <input
                      id="article-upload"
                      type="file"
                      accept="application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setArticleFile(file);
                          setExtractArticleMessage(null);
                        }
                      }}
                    />
                    {articleFile ? (
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--color-primary)",
                            marginBottom: 4,
                          }}
                        >
                          ✓ {articleFile.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                          {(articleFile.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--color-text-muted)",
                            marginBottom: 4,
                          }}
                        >
                          Файлды таңдаңыз немесе осы жерге тастаңыз
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-faint)" }}>
                          PDF, DOC, DOCX
                        </div>
                      </div>
                    )}
                    {uploadProgress ? (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-primary)",
                          marginTop: 8,
                          fontWeight: 600,
                        }}
                      >
                        {uploadProgress}
                      </div>
                    ) : null}
                  </div>

                  {articleFile ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => void handleExtractArticleText()}
                        disabled={extractingArticleText || loading || uploading}
                        style={{
                          border: "1px solid var(--color-border)",
                          borderRadius: 8,
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          padding: "10px 14px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor:
                            extractingArticleText || loading || uploading
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            extractingArticleText || loading || uploading ? 0.6 : 1,
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        {extractingArticleText
                          ? "Мәтін шығарылуда..."
                          : content.trim()
                            ? "Қайта шығару"
                            : "Файлдан мәтінді шығару"}
                      </button>

                      {extractArticleMessage ? (
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 11,
                            borderRadius: 8,
                            padding: "8px 10px",
                            border:
                              extractArticleMessage.tone === "success"
                                ? "1px solid rgba(16,185,129,0.28)"
                                : extractArticleMessage.tone === "info"
                                  ? "1px solid rgba(99,102,241,0.26)"
                                  : "1px solid rgba(180,35,24,0.32)",
                            color:
                              extractArticleMessage.tone === "success"
                                ? "#047857"
                                : extractArticleMessage.tone === "info"
                                  ? "#4338ca"
                                  : "var(--color-error)",
                            background:
                              extractArticleMessage.tone === "success"
                                ? "rgba(16,185,129,0.08)"
                                : extractArticleMessage.tone === "info"
                                  ? "rgba(99,102,241,0.08)"
                                  : "rgba(180,35,24,0.08)",
                          }}
                        >
                          {extractArticleMessage.text}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {type === "news" ? (
              <>
                <label className={labelClass}>
                  Мәтін*
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={10}
                    placeholder="Жаңалықтың қысқаша мазмұны..."
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                </label>
                <label className={labelClass}>
                  Дереккөз сілтемесі
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(event) => setSourceUrl(event.target.value)}
                    placeholder="https://..."
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                </label>
                <label className={labelClass}>
                  Оқиға күні
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                </label>
              </>
            ) : null}

            {type === "podcast" ? (
              <>
                <label className={labelClass}>
                  Сипаттама*
                  <textarea
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    rows={4}
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                </label>
                <div style={{ marginBottom: 16 }}>
                  <label className={labelClass}>АУДИО ФАЙЛ немесе URL</label>

                  <div
                    style={{
                      border: "2px dashed var(--color-border)",
                      borderRadius: 10,
                      padding: "20px",
                      textAlign: "center",
                      marginBottom: 10,
                      background: audioFile ? "rgba(197,64,26,0.04)" : "var(--color-surface)",
                      cursor: "pointer",
                      transition: "border-color 180ms",
                    }}
                    onClick={() => document.getElementById("audio-upload")?.click()}
                  >
                    <input
                      id="audio-upload"
                      type="file"
                      accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) setAudioFile(file);
                      }}
                    />
                    {audioFile ? (
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--color-primary)",
                            marginBottom: 4,
                          }}
                        >
                          ✓ {audioFile.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                          {(audioFile.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--color-text-muted)",
                            marginBottom: 4,
                          }}
                        >
                          Аудио файлды осында тастаңыз
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-faint)" }}>
                          MP3, WAV, OGG, M4A · макс 200MB
                        </div>
                      </div>
                    )}
                    {uploadProgress ? (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-primary)",
                          marginTop: 8,
                          fontWeight: 600,
                        }}
                      >
                        {uploadProgress}
                      </div>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
                    <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>немесе URL</span>
                    <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
                  </div>

                  <input
                    type="url"
                    placeholder="https://..."
                    value={audioUrl}
                    onChange={(event) => {
                      const nextUrl = event.target.value;
                      setAudioUrl(nextUrl);
                      void syncPodcastCoverFromAudioUrl(nextUrl);
                    }}
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                  {podcastCoverHint ? (
                    <div style={{ marginTop: 6, fontSize: 11, color: "#7c3aed" }}>{podcastCoverHint}</div>
                  ) : null}
                </div>
                <label className={labelClass}>
                  Ұзақтығы
                  <input
                    type="text"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    placeholder="45:30"
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                </label>
                <label className={labelClass}>
                  Қонақтар
                  <input
                    type="text"
                    value={guests}
                    onChange={(event) => setGuests(event.target.value)}
                    placeholder="Азамат Нұрланов, Айгүл..."
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                </label>
              </>
            ) : null}

            {type === "material" ? (
              <>
                <label className={labelClass}>
                  Сипаттама
                  <textarea
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    rows={4}
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                </label>
                <div className="flex flex-col gap-3">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                    Файлдар / сілтемелер{materialType === "lecture" ? "" : "*"}
                  </span>
                  <div className="flex flex-col gap-3">
                    {materialResources.map((resource) => (
                      <div
                        key={resource.id}
                        className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3"
                      >
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
                          <input
                            type="text"
                            value={resource.label}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setMaterialResources((prev) =>
                                prev.map((item) =>
                                  item.id === resource.id ? { ...item, label: nextValue } : item,
                                ),
                              );
                            }}
                            placeholder="Атауы (мысалы: 1-тарау PDF)"
                            className={fieldClass}
                            style={{ borderRadius: "8px" }}
                          />
                          <input
                            type="url"
                            value={resource.url}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setMaterialResources((prev) =>
                                prev.map((item) =>
                                  item.id === resource.id
                                    ? {
                                        ...item,
                                        url: nextValue,
                                        file: nextValue.trim() ? null : item.file,
                                      }
                                    : item,
                                ),
                              );
                            }}
                            placeholder="Сілтеме (https://...)"
                            className={fieldClass}
                            style={{ borderRadius: "8px" }}
                          />
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-[color:var(--color-border)] px-3 py-2 text-[12px] font-semibold text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]">
                            Файл таңдау
                            <input
                              type="file"
                              className="hidden"
                              onChange={(event) => {
                                const nextFile = event.target.files?.[0] ?? null;
                                setMaterialResources((prev) =>
                                  prev.map((item) =>
                                    item.id === resource.id
                                      ? {
                                          ...item,
                                          file: nextFile,
                                          url: nextFile ? "" : item.url,
                                        }
                                      : item,
                                  ),
                                );
                              }}
                            />
                          </label>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[color:var(--color-text-faint)]">
                          <span>
                            {resource.file ? `Файл: ${resource.file.name}` : "URL немесе файл қосыңыз"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setMaterialResources((prev) => {
                                if (prev.length === 1) return [createMaterialResourceDraft()];
                                return prev.filter((item) => item.id !== resource.id);
                              });
                            }}
                            className="rounded-[6px] border border-[color:var(--color-border)] px-2 py-1 text-[11px] font-semibold text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-error)] hover:text-[color:var(--color-error)]"
                          >
                            Жою
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMaterialResources((prev) => [...prev, createMaterialResourceDraft()]);
                    }}
                    className="w-fit rounded-[8px] border border-[color:var(--color-border)] px-3 py-2 text-[12px] font-semibold text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                  >
                    + Материал қосу
                  </button>
                  <span className="text-[11px] text-[color:var(--color-text-faint)]">
                    Әр жолға URL не файл тіркей аласыз. Файлдар сақталғаннан кейін материал бетінде жүктеу сілтемелері көрінеді.
                  </span>
                </div>

                {materialType === "book" ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_120px_1fr]">
                    <label className={labelClass}>
                      Автор
                      <input
                        type="text"
                        value={author}
                        onChange={(event) => setAuthor(event.target.value)}
                        placeholder="Иммануил Кант"
                        className={fieldClass}
                        style={{ borderRadius: "8px" }}
                      />
                    </label>
                    <label className={labelClass}>
                      Жылы
                      <input
                        type="number"
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                        placeholder="1781"
                        className={fieldClass}
                        style={{ borderRadius: "8px" }}
                      />
                    </label>
                    <label className={labelClass}>
                      Тілі
                      <select
                        value={language}
                        onChange={(event) => setLanguage(event.target.value)}
                        className={fieldClass}
                        style={{ borderRadius: "8px" }}
                      >
                        <option>Қаз</option>
                        <option>Орыс</option>
                        <option>Ағылшын</option>
                        <option>Неміс</option>
                        <option>Басқа</option>
                      </select>
                    </label>
                  </div>
                ) : null}

                {materialType === "lecture" ? (
                  <label className={labelClass}>
                    Дәріс мазмұны*
                    <textarea
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      rows={14}
                      placeholder="Дәріс мазмұны..."
                      className={fieldClass}
                      style={{ borderRadius: "8px" }}
                    />
                  </label>
                ) : null}
              </>
            ) : null}
          </div>

          <aside className="flex flex-col gap-5">
            {type === "news" ? (
              <Panel title="ЖАРИЯЛАУ">
                <StatusPills status={status} setStatus={setStatus} accent={config.accent} />
              </Panel>
            ) : null}

            {type === "podcast" ? (
              <Panel title="ТІЛ">
                <label className={labelClass}>
                  Тіл
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  >
                    <option>Қазақша</option>
                    <option>Орысша</option>
                    <option>Ағылшынша</option>
                  </select>
                </label>
              </Panel>
            ) : null}

            {type === "material" ? (
              <Panel title="ДЕҢГЕЙ">
                <StatusLikePills
                  options={[
                    ["all", "Барлығы"],
                    ["bachelor", "Бакалавр"],
                    ["master", "Магистр"],
                    ["phd", "PhD"],
                  ]}
                  value={level}
                  setValue={(value) => setLevel(value as Level)}
                  accent={config.accent}
                />
                <label className={labelClass}>
                  Пән
                  <input
                    type="text"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Онтология, Этика..."
                    className={fieldClass}
                    style={{ borderRadius: "8px" }}
                  />
                </label>
              </Panel>
            ) : null}

            {type === "article" ? (
              <>
                <div
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    padding: "20px",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--color-text-muted)",
                      marginBottom: 14,
                    }}
                  >
                    ОБЛОЖКА
                  </div>

                  <div
                    onClick={() => document.getElementById("cover-upload")?.click()}
                    style={{
                      position: "relative",
                      aspectRatio: "16/9",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "2px dashed var(--color-border)",
                      background: coverPreview ? "transparent" : "var(--color-surface-offset)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                      transition: "border-color 180ms",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.borderColor = "var(--color-primary)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    {coverPreview ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverPreview}
                          alt="cover"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 180ms",
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.opacity = "1";
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.opacity = "0";
                          }}
                        >
                          <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>
                            ✎ Өзгерту
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: "center", padding: 16 }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>🖼</div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--color-text-muted)",
                            fontWeight: 600,
                            marginBottom: 4,
                          }}
                        >
                          Обложка жүктеу
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-faint)" }}>
                          JPG, PNG, WEBP · 16:9 ұсынылады
                        </div>
                      </div>
                    )}
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) setCoverFile(file);
                      }}
                    />
                  </div>

                  {coverFile ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 11,
                        color: "var(--color-text-muted)",
                      }}
                    >
                      <span>✓ {coverFile.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCoverFile(null);
                          setCoverPreview("");
                        }}
                        style={{
                          fontSize: 11,
                          color: "var(--color-error)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        ✕ Жою
                      </button>
                    </div>
                  ) : null}
                </div>

                <div
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--color-text-muted)",
                      marginBottom: 12,
                    }}
                  >
                    ДЕРЕККӨЗ
                  </div>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={sourceUrl}
                    onChange={(event) => setSourceUrl(event.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: 13,
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      color: "var(--color-text)",
                      outline: "none",
                    }}
                  />
                  <div style={{ fontSize: 11, color: "var(--color-text-faint)", marginTop: 6 }}>
                    Мақала алынған сайт немесе бастапқы дерек
                  </div>
                </div>
              </>
            ) : (
              <CoverPanel
                title={
                  type === "material"
                    ? "ПРЕВЬЮ / МҰҚАБА"
                    : type === "podcast"
                      ? "МҰҚАБА"
                      : "МЕДИА"
                }
                coverImage={coverImage}
                coverPreview={coverPreview}
                coverFile={coverFile}
                setCoverImage={setCoverImage}
                setCoverFile={setCoverFile}
                setCoverPreview={setCoverPreview}
                placeholder={type === "material" ? "https://.../cover.jpg" : "https://..."}
                helperText={
                  type === "material"
                    ? "Суретті drag & drop арқылы тастаңыз немесе файл таңдаңыз (JPG, PNG, WEBP). Міндетті емес."
                    : type === "podcast"
                      ? "Суретті drag & drop арқылы тастаңыз немесе файл таңдаңыз (JPG, PNG, WEBP). Міндетті емес."
                      : undefined
                }
                uploadOnly={type === "material" || type === "podcast"}
              />
            )}
          </aside>
        </div>

        <footer className="flex justify-end gap-3 border-t border-[color:var(--color-border)] pt-5">
          {type !== "article" ? (
            <button
              type="button"
              disabled={loading || uploading}
              onClick={() => void handleSave("draft")}
              className="rounded-[8px] border border-[color:var(--color-border)] px-5 py-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Жүктелуде..." : "Жоба сақтау"}
            </button>
          ) : null}
          <button
            type="button"
            disabled={loading || uploading}
            onClick={() => void handleSave("published")}
            className="rounded-[8px] px-5 py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: config.accent }}
          >
            {uploading ? "Жүктелуде..." : "Жариялау"}
          </button>
        </footer>
      </form>
    </section>
  );
}

function StatusLikePills({
  options,
  value,
  setValue,
  accent,
}: {
  options: Array<[string, string]>;
  value: string;
  setValue: (value: string) => void;
  accent: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([optionValue, label]) => {
        const active = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => setValue(optionValue)}
            className="rounded-full border px-3 py-2 text-[12px] transition-colors"
            style={{
              borderColor: active ? accent : "var(--color-border)",
              background: active ? `${accent}15` : "transparent",
              color: active ? accent : "var(--color-text-muted)",
              fontWeight: active ? 600 : 500,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
