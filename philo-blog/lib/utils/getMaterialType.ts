export type MaterialType = "pdf" | "pptx" | "docx" | "other";

export interface MaterialMeta {
  type: MaterialType;
  label: string;
  color: string;
  icon: string;
}

export function getMaterialType(fileUrl: string): MaterialMeta {
  const url = (fileUrl || "").toLowerCase();

  if (url.endsWith(".pdf") || url.includes(".pdf")) {
    return { type: "pdf", label: "PDF", color: "#E53E3E", icon: "📄" };
  }

  if (url.endsWith(".pptx") || url.includes(".pptx")) {
    return { type: "pptx", label: "PPT", color: "#C5401A", icon: "📊" };
  }

  if (url.endsWith(".docx") || url.includes(".docx")) {
    return { type: "docx", label: "DOCX", color: "#2B6CB0", icon: "📝" };
  }

  return { type: "other", label: "FILE", color: "#718096", icon: "📎" };
}
