"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { mockCategories } from "@/lib/queries/mockPosts";

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const suggestedTags = [
  "Философия",
  "Этика",
  "Цифровизация",
  "Редактура",
  "ЖАИ",
  "Қоғам",
  "Технология",
  "Мәдениет",
];

const cyrillicMap: Record<string, string> = {
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
  қ: "q",
  л: "l",
  м: "m",
  н: "n",
  ң: "ng",
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
  щ: "sh",
  ы: "y",
  і: "i",
  э: "e",
  ю: "yu",
  я: "ya",
  ъ: "",
  ь: "",
};

function slugify(value: string) {
  const normalized = value
    .trim()
    .toLocaleLowerCase("kk-KZ")
    .split("")
    .map((char) => cyrillicMap[char] ?? char)
    .join("");

  return normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));

  return { words, minutes };
}

function renderPreview(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let codeBuffer: string[] = [];
  let inCodeBlock = false;

  const flushParagraph = (key: string) => {
    if (!paragraphBuffer.length) {
      return;
    }

    elements.push(<p key={key}>{paragraphBuffer.join(" ")}</p>);
    paragraphBuffer = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushParagraph(`paragraph-before-code-${index}`);

      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`}>
            <code>{codeBuffer.join("\n")}</code>
          </pre>,
        );
        codeBuffer = [];
      }

      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph(`paragraph-${index}`);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph(`paragraph-before-h3-${index}`);
      elements.push(<h3 key={`h3-${index}`}>{trimmed.slice(4)}</h3>);
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph(`paragraph-before-h2-${index}`);
      elements.push(<h2 key={`h2-${index}`}>{trimmed.slice(3)}</h2>);
      return;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph(`paragraph-before-quote-${index}`);
      elements.push(
        <blockquote key={`quote-${index}`}>{trimmed.slice(2)}</blockquote>,
      );
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph(`paragraph-before-list-${index}`);
      elements.push(
        <ul key={`list-${index}`}>
          <li>{trimmed.slice(2)}</li>
        </ul>,
      );
      return;
    }

    paragraphBuffer.push(trimmed);
  });

  flushParagraph("paragraph-end");

  if (codeBuffer.length) {
    elements.push(
      <pre key="code-end">
        <code>{codeBuffer.join("\n")}</code>
      </pre>,
    );
  }

  return elements;
}

export function NewPostEditor({ defaultType }: { defaultType?: string }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [postType] = useState(defaultType || "article");
  const [content, setContent] = useState(
    "## Кіріспе\n\nМұнда мақалаңыздың алғашқы бөлімін жазыңыз.\n\n### Негізгі ой\n\nНегізгі аргументті осында жалғастырыңыз.",
  );
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState("draft");
  const [categorySlug, setCategorySlug] = useState(mockCategories[0]?.slug ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Философия"]);
  const [tagInput, setTagInput] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isSlugEdited) {
      setSlug(slugify(title));
    }
  }, [isSlugEdited, title]);

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const filteredTagSuggestions = useMemo(() => {
    const normalizedInput = tagInput.trim().toLocaleLowerCase("kk-KZ");

    return suggestedTags.filter((tag) => {
      if (selectedTags.includes(tag)) {
        return false;
      }

      if (!normalizedInput) {
        return true;
      }

      return tag.toLocaleLowerCase("kk-KZ").includes(normalizedInput);
    });
  }, [selectedTags, tagInput]);

  const { words, minutes } = useMemo(
    () => estimateReadTime(content),
    [content],
  );

  const addTag = (value: string) => {
    const normalized = value.trim();

    if (!normalized || selectedTags.includes(normalized)) {
      setTagInput("");
      return;
    }

    setSelectedTags((current) => [...current, normalized]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setSelectedTags((current) => current.filter((item) => item !== tag));
  };

  const handleContentKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${content.slice(0, start)}\t${content.slice(end)}`;

    setContent(nextValue);

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    });
  };

  const handleCoverChange = (file: File | null) => {
    if (!file) {
      return;
    }

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    // TODO: Upload selected cover image to Supabase Storage and persist the returned URL.
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
  };

  const handlePublish = () => {
    // TODO: Save draft/published post data to Supabase and redirect to the admin posts list.
    void {
      title,
      slug,
      excerpt,
      content,
      status,
      categorySlug,
      selectedTags,
      postType,
    };
  };

  return (
    <div className="grid grid-cols-1 gap-[var(--space-8)] lg:grid-cols-[3fr_2fr]">
      <section className="min-w-0">
        <div className="flex items-center justify-between gap-4 border-b border-[color:var(--color-divider)] pb-[var(--space-4)]">
          <div className="flex items-center gap-3">
            <p className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.16em] text-[color:var(--color-text-faint)]">
              {postType === "article" ? "Жаңа мақала" : postType === "news" ? "Жаңалық" : postType === "podcast" ? "Подкаст" : postType === "material" ? "Материал" : "Редактор"}
            </p>
            <span className="inline-flex items-center rounded-full bg-[color:var(--color-primary-highlight)] px-2.5 py-0.5 font-ui text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-primary)]">
              {postType}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPreview((current) => !current)}
            className="button-ghost min-h-11"
          >
            {isPreview ? "Өңдеу" : "Алдын ала қарау"}
          </button>
        </div>

        <div className="mt-[var(--space-6)] flex flex-col gap-[var(--space-5)]">
          <label className="flex flex-col gap-2">
            <span className="sr-only">Мақала тақырыбы</span>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Мақала тақырыбы..."
              className="w-full border-0 bg-transparent px-0 font-display text-[length:var(--text-xl)] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-faint)]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
              Slug
            </span>
            <input
              type="text"
              value={slug}
              onChange={(event) => {
                setIsSlugEdited(true);
                setSlug(slugify(event.target.value));
              }}
              className="w-full border-0 bg-transparent px-0 font-mono text-[length:var(--text-sm)] text-[color:var(--color-text-muted)] outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
              Қысқаша сипаттама
            </span>
            <textarea
              id="post-excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={3}
              placeholder="Қысқаша сипаттама..."
              className="w-full resize-none border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 font-body text-[length:var(--text-base)] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-faint)]"
              style={{ borderRadius: "var(--radius-md)" }}
            />
          </label>

          {isPreview ? (
            <div
              className="article-prose min-h-[400px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-6)]"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <h1>{title || "Мақала тақырыбы..."}</h1>
              {excerpt ? <p>{excerpt}</p> : null}
              {renderPreview(content)}
            </div>
          ) : (
            <label className="flex flex-col gap-2">
              <span className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
                Markdown мәтіні
              </span>
              <textarea
                id="post-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onKeyDown={handleContentKeyDown}
                placeholder="Markdown арқылы жаза бастаңыз..."
                className="min-h-[400px] w-full resize-y border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-4 font-mono text-[length:var(--text-sm)] leading-7 text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-faint)]"
                style={{ borderRadius: "var(--radius-md)" }}
              />
            </label>
          )}
        </div>
      </section>

      <motion.aside
        initial={prefersReducedMotion ? false : { x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
        }
        className="lg:sticky lg:top-24 lg:self-start"
      >
        <div
          className="flex flex-col gap-[var(--space-8)] border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-[var(--space-6)]"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <section className="flex flex-col gap-[var(--space-4)]">
            <div className="section-rule">Жариялау</div>

            <label className="flex flex-col gap-2">
              <span className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
                Status
              </span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="min-h-11 border border-[color:var(--color-border)] bg-transparent px-4 font-ui text-[length:var(--text-sm)] text-[color:var(--color-text)] outline-none"
                style={{ borderRadius: "var(--radius-md)" }}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </label>

            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex min-h-11 w-full items-center justify-center bg-[color:var(--color-primary)] font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-inverse)] transition-colors duration-200 hover:bg-[color:var(--color-primary-hover)]"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              Жариялау
            </button>
          </section>

          <section className="flex flex-col gap-[var(--space-4)]">
            <div className="section-rule">Cover Image</div>

            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-[color:var(--color-border)] px-6 py-[var(--space-8)] text-center transition-colors duration-200 hover:border-[color:var(--color-primary)]"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) =>
                  handleCoverChange(event.target.files?.[0] ?? null)
                }
              />
              <Upload
                size={22}
                strokeWidth={1.8}
                className="text-[color:var(--color-primary)]"
              />
              <div className="flex flex-col gap-1">
                <span className="font-ui text-[length:var(--text-sm)] font-semibold text-[color:var(--color-text)]">
                  Суретті сүйреп апарыңыз
                </span>
                <span className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
                  немесе файл таңдаңыз
                </span>
              </div>
            </label>

            {coverPreview ? (
              <div className="overflow-hidden border border-[color:var(--color-border)]" style={{ borderRadius: "var(--radius-md)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview}
                  alt="Таңдалған мұқаба суретінің алдын ала көрінісі"
                  width={1280}
                  height={720}
                  className="aspect-video w-full object-cover"
                />
              </div>
            ) : null}
          </section>

          <section className="flex flex-col gap-[var(--space-4)]">
            <div className="section-rule">Категория</div>
            <label className="flex flex-col gap-2">
              <span className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
                Категория
              </span>
              <select
                id="post-category"
                value={categorySlug}
                onChange={(event) => setCategorySlug(event.target.value)}
                className="min-h-11 border border-[color:var(--color-border)] bg-transparent px-4 font-ui text-[length:var(--text-sm)] text-[color:var(--color-text)] outline-none"
                style={{ borderRadius: "var(--radius-md)" }}
              >
                {mockCategories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="flex flex-col gap-[var(--space-4)]">
            <div className="section-rule">Tags</div>
            <div
              className="flex flex-wrap items-center gap-2 border border-[color:var(--color-border)] px-3 py-3"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface-2)] px-3 py-1.5 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.12em] text-[color:var(--color-text)]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="-m-1 inline-flex h-11 w-11 items-center justify-center text-[color:var(--color-text-faint)] transition-colors duration-200 hover:text-[color:var(--color-primary)]"
                    aria-label={`${tag} тегін өшіру`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <label htmlFor="post-tags" className="sr-only">
                Тегтерді қосу
              </label>
              <input
                id="post-tags"
                type="text"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="Тег қосу..."
                className="min-w-[9rem] flex-1 border-0 bg-transparent font-ui text-[length:var(--text-sm)] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-faint)]"
              />
            </div>

            {filteredTagSuggestions.length ? (
              <div className="flex flex-wrap gap-2">
                {filteredTagSuggestions.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--color-border)] px-3 py-1.5 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)] transition-colors duration-200 hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="flex flex-col gap-[var(--space-3)] border-t border-[color:var(--color-divider)] pt-[var(--space-5)]">
            <div className="flex items-center justify-between font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
              <span>Сөз саны</span>
              <span>{words}</span>
            </div>
            <div className="flex items-center justify-between font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
              <span>Оқу уақыты</span>
              <span>{minutes} мин</span>
            </div>
          </section>
        </div>
      </motion.aside>
    </div>
  );
}
