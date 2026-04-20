import mammoth from "mammoth";

const STRUCTURED_PREFIX_RE = /^(Аңдатпа:|Кілт сөздер:|##|###|-|>)/u;

export function normalizeExtractedArticleText(rawText: string): string {
  const normalizedNewlines = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ");

  const cleanedLines = normalizedNewlines
    .split("\n")
    .map((line) => {
      const lineWithoutTrailingSpaces = line.replace(/[ \t]+$/g, "");
      const trimmedStart = lineWithoutTrailingSpaces.trimStart();

      if (!trimmedStart) {
        return "";
      }

      const compactSpaces = trimmedStart.replace(/[ \t]{2,}/g, " ");

      const normalizedStructuredPrefix = compactSpaces.replace(
        /^(###|##|>)(\S)/u,
        "$1 $2",
      );

      if (STRUCTURED_PREFIX_RE.test(normalizedStructuredPrefix)) {
        return normalizedStructuredPrefix;
      }

      return normalizedStructuredPrefix.trim();
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return cleanedLines;
}

export async function extractDocxTextFromBuffer(buffer: Buffer): Promise<string> {
  const extractionResult = await mammoth.extractRawText({ buffer });
  return normalizeExtractedArticleText(extractionResult.value ?? "");
}
