import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalizeInstagramPostUrl(rawUrl: string | null): string | null {
  if (!rawUrl?.trim()) return null;

  try {
    const parsed = new URL(rawUrl.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host !== "instagram.com" && host !== "m.instagram.com" && host !== "instagr.am") {
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

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/gi, "/");
}

function extractMetaContent(
  html: string,
  options: { key: string; attribute: "property" | "name" },
): string | null {
  const escapedKey = options.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const patterns = [
    new RegExp(
      `<meta[^>]*${options.attribute}=["']${escapedKey}["'][^>]*content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']+)["'][^>]*${options.attribute}=["']${escapedKey}["'][^>]*>`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    const content = match?.[1]?.trim();

    if (content) {
      return decodeHtmlEntities(content);
    }
  }

  return null;
}

function extractInstagramCoverUrl(html: string, baseUrl: string): string | null {
  const metaCandidates: Array<{ key: string; attribute: "property" | "name" }> = [
    { key: "og:image", attribute: "property" },
    { key: "og:image:secure_url", attribute: "property" },
    { key: "twitter:image", attribute: "name" },
  ];

  for (const candidate of metaCandidates) {
    const raw = extractMetaContent(html, candidate);
    if (!raw) continue;

    try {
      return new URL(raw, baseUrl).toString();
    } catch {
      continue;
    }
  }

  return null;
}

async function fetchInstagramOembedThumbnail(
  instagramUrl: string,
  signal: AbortSignal,
): Promise<string | null> {
  const endpoint = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(instagramUrl)}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        accept: "application/json",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
      cache: "no-store",
      signal,
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      thumbnail_url?: string;
      thumbnail_url_with_play_button?: string;
    };

    const thumbnail = payload.thumbnail_url?.trim();
    if (thumbnail) return thumbnail;

    const thumbnailWithPlay = payload.thumbnail_url_with_play_button?.trim();
    return thumbnailWithPlay || null;
  } catch {
    return null;
  }
}

async function resolveInstagramCoverUrl(
  instagramUrl: string,
  signal: AbortSignal,
): Promise<string | null> {
  const oembedCover = await fetchInstagramOembedThumbnail(instagramUrl, signal);
  if (oembedCover) return oembedCover;

  const response = await fetch(instagramUrl, {
    method: "GET",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    redirect: "follow",
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  return extractInstagramCoverUrl(html, instagramUrl);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const instagramUrl = normalizeInstagramPostUrl(requestUrl.searchParams.get("url"));
  const mode = requestUrl.searchParams.get("mode");

  if (!instagramUrl) {
    return NextResponse.json(
      {
        ok: false,
        message: "Тек Instagram reel/post сілтемесі қолдау табады.",
      },
      { status: 400 },
    );
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 9000);

  try {
    const imageUrl = await resolveInstagramCoverUrl(instagramUrl, abortController.signal);

    if (!imageUrl) {
      if (mode === "image") {
        return new NextResponse("", { status: 404 });
      }

      return NextResponse.json(
        {
          ok: false,
          message: "Instagram обложка табылмады.",
        },
        { status: 404 },
      );
    }

    if (mode === "image") {
      const imageResponse = await fetch(imageUrl, {
        method: "GET",
        headers: {
          accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        },
        cache: "no-store",
        signal: abortController.signal,
      });

      if (!imageResponse.ok) {
        return new NextResponse("", { status: 502 });
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }

    return NextResponse.json({ ok: true, imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Белгісіз қате";

    return NextResponse.json(
      {
        ok: false,
        message: `Instagram обложка алу қатесі: ${message}`,
      },
      { status: 500 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
