import type { Metadata } from "next";
import { NewPostEditor } from "@/components/admin/NewPostEditor";

export const metadata: Metadata = {
  title: "Жаңа мақала | Admin Panel",
  description: "Philo Blog әкімшілік панеліндегі жаңа мақала құру беті.",
};

export default function NewPostPage() {
  return <NewPostEditor />;
}
