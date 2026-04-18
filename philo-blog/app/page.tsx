import { ArticleGridSection } from "@/components/blog/ArticleGridSection";
import { HeroSection } from "@/components/blog/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col gap-[clamp(var(--space-12),6vw,var(--space-20))]">
      <HeroSection />
      <ArticleGridSection />
    </div>
  );
}
