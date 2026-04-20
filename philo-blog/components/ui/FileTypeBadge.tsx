import { getMaterialType } from "@/lib/utils/getMaterialType";

export function FileTypeBadge({ fileUrl }: { fileUrl: string }) {
  const meta = getMaterialType(fileUrl);

  return (
    <span className="file-type-badge" style={{ background: meta.color }}>
      {meta.label}
    </span>
  );
}
