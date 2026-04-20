import { NextResponse } from "next/server";
import { extractDocxTextFromBuffer } from "@/lib/articles/extract";

export const runtime = "nodejs";

function isPdfFile(fileName: string, mimeType: string): boolean {
  return mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
}

function isDocxFile(fileName: string, mimeType: string): boolean {
  return (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.toLowerCase().endsWith(".docx")
  );
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Файлды multipart/form-data форматында жіберіңіз.",
        },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const uploadedFile = formData.get("file");

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Файл табылмады.",
        },
        { status: 400 },
      );
    }

    if (uploadedFile.size === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Бос файлды өңдеу мүмкін емес.",
        },
        { status: 400 },
      );
    }

    const fileName = uploadedFile.name || "article";
    const mimeType = uploadedFile.type || "";

    if (isPdfFile(fileName, mimeType)) {
      return NextResponse.json({
        ok: false,
        code: "UNSUPPORTED_PDF",
        message: "PDF мәтінін автоматты шығару кейін қосылады",
      });
    }

    if (!isDocxFile(fileName, mimeType)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Қазір тек DOCX файлынан мәтін шығару қолжетімді.",
        },
        { status: 400 },
      );
    }

    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    const extractedText = await extractDocxTextFromBuffer(fileBuffer);

    if (!extractedText.trim()) {
      return NextResponse.json({
        ok: false,
        message: "Файлдан мәтін табылмады. Қолжетімді бөлігін қолмен қосып көріңіз.",
      });
    }

    return NextResponse.json({
      ok: true,
      text: extractedText,
      message: "Мәтін файлдан толтырылды. Жариялар алдында тексеріңіз.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Белгісіз қате";

    return NextResponse.json(
      {
        ok: false,
        message: `Мәтінді шығару сәтсіз аяқталды: ${message}`,
      },
      { status: 500 },
    );
  }
}
