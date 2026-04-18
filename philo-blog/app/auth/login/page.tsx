import type { Metadata } from "next";
import { LoginCard } from "@/components/admin/LoginCard";

export const metadata: Metadata = {
  title: "Жүйеге кіру | ZERDE Blog",
  description: "Philo Blog әкімшілік панеліне кіру беті.",
};

export default function LoginPage() {
  return (
    <section className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-[clamp(var(--space-12),8vw,var(--space-24))]">
      <LoginCard />
    </section>
  );
}
