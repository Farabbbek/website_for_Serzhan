"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

export default function AboutPage() {
  const { locale, m } = useLanguage();
  const strategies =
    locale === "ru"
      ? [
          "Поднять качество медиаконтента в социальных сетях до профессионального уровня",
          "Выстроить партнёрство с факультетскими блогерами",
          "Эффективно продвигать проекты",
          "Представлять факультет философии и психологии за пределами Караганды",
          "Формировать устойчивое сообщество молодых философов",
          "Предлагать философии прогрессивные мнения и новые взгляды",
        ]
      : locale === "en"
        ? [
            "Raise the quality of social media content to a professional level",
            "Build partnerships with faculty bloggers",
            "Promote projects effectively",
            "Represent the Faculty of Philosophy and Psychology beyond Karaganda",
            "Build a sustainable community of young philosophers",
            "Offer progressive opinions and new perspectives in philosophy",
          ]
        : [
            "Әлеуметтік желілердегі медиа контентті кәсіби деңгейге көтеру",
            "Факультет блогерлерімен серіктестік орнату",
            "Жобаларды тиімді жарнамалау",
            "Философия және психология факультетін Қарағандыдан тыс аймақтарда таныту",
            "Жас философтар арасында тұрақты қауымдастық қалыптастыру",
            "Философияға прогрессивті пікірлер мен жаңа көзқарастар ұсыну",
          ];

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let scrollFallbackAttached = false;

    const revealInView = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(".about-page .reveal:not(.visible)"));
      if (!els.length) return;

      if (!observer) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                entry.target.removeAttribute("data-reveal-observed");
                observer?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
        );
      }

      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top <= window.innerHeight - 40 && rect.bottom >= 0;

        if (inView) {
          el.classList.add("visible");
          el.removeAttribute("data-reveal-observed");
          observer?.unobserve(el);
          return;
        }

        if (el.dataset.revealObserved === "true") return;
        el.dataset.revealObserved = "true";
        observer?.observe(el);
      });
    };

    const attachScrollFallback = () => {
      if (scrollFallbackAttached) return;
      scrollFallbackAttached = true;
      window.addEventListener("scroll", revealInView, { passive: true });
      window.addEventListener("resize", revealInView);
    };

    const frameId = window.requestAnimationFrame(() => {
      revealInView();
      attachScrollFallback();
    });
    const timeoutA = window.setTimeout(revealInView, 120);
    const timeoutB = window.setTimeout(revealInView, 420);
    const mutationObserver = new MutationObserver(() => revealInView());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutA);
      window.clearTimeout(timeoutB);
      window.removeEventListener("scroll", revealInView);
      window.removeEventListener("resize", revealInView);
      mutationObserver.disconnect();
      observer?.disconnect();
    };
  }, []);

  return (
    <div className="about-page-shell about-page">
      <section className="about-hero-editorial">
        <div className="about-hero-topline">
          <span>Е.А.БӨКЕТОВ АТЫНДАҒЫ КАРУ</span>
          <span className="hero-dot" />
          <span>Ф-23-1К</span>
          <span className="hero-dot" />
          <span>ҚАРАҒАНДЫ</span>
        </div>

        <div className="about-hero-main">
          <div className="about-hero-word-wrap">
            <h1 className="about-hero-word">ZERDE</h1>
          </div>

          <div className="about-hero-sub-wrap">
            <p className="about-hero-subtitle">{m.about.subtitle}</p>
          </div>
        </div>

        <div className="about-hero-bottomline">
          <p className="about-hero-note">{m.about.note}</p>

          <div className="about-scroll-indicator" aria-hidden="true">
            <span>{m.about.down}</span>
            <div className="scroll-line" />
          </div>
        </div>
      </section>

      <section className="about-marquee-strip" aria-hidden="true">
        <div className="about-marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="about-marquee-item">
              ZERDE · ФИЛОСОФИЯ · ОЙЛАУ · ҚАУЫМДАСТЫҚ · ДИАЛОГ ·
            </span>
          ))}
        </div>
      </section>

      <div className="about-section-transition reveal">
        <span className="transition-label">{m.about.transition}</span>
        <div className="transition-rule" />
      </div>

      <section className="about-section about-mission reveal">
        <div className="about-section-label-col">
          <span className="about-section-label">{m.about.missionLabel}</span>
        </div>
        <div className="about-section-content-col">
          <p>{m.about.mission1}</p>
          <p>{m.about.mission2}</p>
          <p>{m.about.mission3}</p>
        </div>
      </section>

      <section className="about-quote-full reveal">
        <div className="about-quote-inner">
          <blockquote className="about-blockquote">{m.about.quote1}</blockquote>
          <p className="about-quote-second">{m.about.quote2}</p>
          <span className="about-quote-attr">{m.about.quoteTitle}</span>
        </div>
      </section>

      <section className="about-section about-strategy reveal">
        <div className="about-section-label-col">
          <span className="about-section-label">{m.about.strategyLabel}</span>
        </div>
        <div className="about-strategy-list">
          {strategies.map((item, i) => (
            <div key={i} className="strategy-row reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="strategy-num">{String(i + 1).padStart(2, "0")}</span>
              <p className="strategy-text">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-us-full reveal">
        <div className="about-us-img-side">
          <img
            src="https://pplx-res.cloudinary.com/image/upload/pplx_search_images/f16b530876b942db713e40be67a59ae16c4614d3.jpg"
            alt={m.about.university}
            className="about-us-photo"
            loading="lazy"
          />
          <div className="about-us-img-caption">{m.about.university}</div>
        </div>

        <div className="about-us-text-side">
          <span className="about-section-label">{m.about.aboutLabel}</span>
          <h2 className="about-us-group">Ф-23-1К</h2>

          <div className="about-us-paragraphs">
            <p>{m.about.about1}</p>
            <p>{m.about.about2}</p>
            <p>{m.about.about3}</p>
          </div>

          <div className="about-us-meta-row">
            <span>{m.about.metaUniversity}</span>
            <span className="meta-dot">·</span>
            <span>{m.about.metaCity}</span>
          </div>
        </div>
      </section>

    </div>
  );
}
