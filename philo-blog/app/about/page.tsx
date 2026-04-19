import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>

      {/* ─── SECTION 1: HERO — БІЗ ТУРАЛЫ ─── */}
      <section style={{
        borderBottom: "1px solid var(--color-divider)",
        padding: "clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px)",
        maxWidth: 1200,
        margin: "0 auto"
      }}>
        <div>
          {/* Eyebrow label */}
          <p style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#C5401A",
            marginBottom: 16
          }}>
            Ф-23-1К · КарГУ · 2026
          </p>

          {/* Big heading */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
            marginBottom: 32,
            maxWidth: 800
          }}>
            БІЗ ТУРАЛЫ
          </h1>

          {/* Description paragraph */}
          <p style={{
            fontFamily: "var(--font-ui)",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            lineHeight: 1.9,
            color: "var(--color-text)",
            maxWidth: 720
          }}>
            БІЗ Е.А.БӨКЕТОВ АТЫНДАҒЫ ФИЛОСОФИЯ ЖӘНЕ ПСИХОЛОГИЯ 
            ФАКУЛЬТЕТІНІҢ Ф-23-1К АТАЛАТЫН 3 КУРС СТУДЕНТТЕРІМІЗ. 
            БІЗДІҢ ТОБЫМЫЗДЫҢ ЕРЕКШЕЛІГІ БІЗДІҢ АЗШЫЛДЫҒЫМЫЗ, 
            ИНДИВИДУАЛДЫ ТОП БОЛҒАНЫМЫЗ. КУРАТОРЫМЫЗ БОЛСА 
            МАРАТ ЖҮМАГЕЛЬДИНОВ. БІЗДІҢ ОҚУ БАҒДАРЛАМАМЫЗДЫҢ 
            ЕРЕКШЕЛІГІ НАҚТЫ КЛАССИКАЛЫҚ ФИЛОСОФИЯНЫ ЖӘНЕ 
            БІЛІМГЕ ДЕГЕН ҚҰШТАРЛЫҚТЫ НЕГІЗ ҚЫЛУ, ҚАЗАҚСТАН 
            ПРОГРЕССИВТІ ҚОҒАМЫНЫҢ БЕТІ БОЛУ.
          </p>
        </div>
      </section>

      {/* ─── SECTION 2: ЖОБА МАҚСАТЫ — image + text ─── */}
      <section className="about-section-grid" style={{
        borderBottom: "1px solid var(--color-divider)",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px)",
        display: "grid",
        gap: "clamp(32px, 4vw, 64px)",
        alignItems: "center"
      }}>
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <Image
            src="https://picsum.photos/seed/kargu-university/800/600"
            alt="Е.А.Бөкетов атындағы КарГУ"
            width={800}
            height={600}
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              filter: "grayscale(20%)",
              transition: "filter 400ms ease"
            }}
            className="hover:filter-[grayscale(0%)]"
          />
        </div>

        {/* Text */}
        <div>
          <p style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#C5401A",
            marginBottom: 12
          }}>
            Жоба туралы
          </p>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "var(--color-text)",
            marginBottom: 24,
            letterSpacing: "-0.01em"
          }}>
            ЖОБА МАҚСАТЫ
          </h2>

          <p style={{
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            lineHeight: 1.85,
            color: "var(--color-text-muted)"
          }}>
            БІЗДІҢ ЖОБА — БҮКІЛ ҚАЗАҚСТАН БОЙЫНША ФИЛОСОФИЯ 
            СТУДЕНТТЕРІН БІРІКТІРЕТІН ЗАМАНАУИ ОНЛАЙН-ПЛАТФОРМА 
            ҚҰРУҒА БАҒЫТТАЛҒАН. САЙТТЫҢ НЕГІЗГІ МАҚСАТЫ — 
            СТУДЕНТТЕР АРАСЫНДА ТҰРАҚТЫ БАЙЛАНЫС ОРНАТЫП, 
            ОРТАҚ ИНТЕЛЛЕКТУАЛДЫ КЕҢІСТІК ҚАЛЫПТАСТЫРУ. 
            ПЛАТФОРМА АРҚЫЛЫ ҚАТЫСУШЫЛАР АКАДЕМИЯЛЫҚ 
            МАТЕРИАЛДАРМЕН АЛМАСЫП, ПІКІРТАЛАСТАР ҰЙЫМДАСТЫРЫП, 
            БІРЛЕСКЕН ЖОБАЛАРДЫ ЖҮЗЕГЕ АСА АЛАДЫ.
          </p>
        </div>
      </section>

      {/* ─── SECTION 3: БІЗДІҢ СТРАТЕГИЯМЫЗ — numbered list ─── */}
      <section style={{
        borderBottom: "1px solid var(--color-divider)",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px)",
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
            marginBottom: 40
          }}>
            БІЗДІҢ СТРАТЕГИЯМЫЗ:
          </h2>

          {/* Strategy items */}
          {[
            'ӘЛЕУМЕТТІК ЖЕЛІЛЕРДЕГІ МЕДИА КОНТЕНТТІ КӘСІБИ ДЕҢГЕЙГЕ КӨТЕРУ',
            'ФАКУЛЬТЕТ БЛОГЕРЛЕРІМЕН СЕРІКТЕСТІК ОРНАТУ',
            'ЖОБАЛАРДЫ ТИІМДІ ЖАРНАМАЛАУ',
            'ФИЛОСОФИЯ ЖӘНЕ ПСИХОЛОГИЯ ФАКУЛЬТЕТІН ҚАРАҒАНДЫДАН ТЫС АЙМАҚТАРДА ТАНЫМАЛ ЕТУ',
            'ФИЛОСОФТАР АРАСЫНДА ТҰРАҚТЫ КОМЬЮНИТИ ҚАЛЫПТАСТЫРУ'
          ].map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 24,
                padding: "20px 0",
                borderTop: "1px solid var(--color-divider)",
                cursor: "default"
              }}
            >
              {/* Number */}
              <span style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                fontWeight: 600,
                color: "#C5401A",
                letterSpacing: "0.1em",
                minWidth: 28,
                paddingTop: 2
              }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {/* Text */}
              <span style={{
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                lineHeight: 1.7,
                color: "var(--color-text)"
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 4: КТО МЫ — team stats ─── */}
      <section style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px)",
        borderBottom: "1px solid var(--color-divider)"
      }}>
        <div
          className="about-stats-grid"
          style={{
            display: "grid",
            gap: "1px",
            background: "var(--color-divider)"
          }}
        >
          {[
            { number: "3", label: "КУРС" },
            { number: "Ф-23-1К", label: "ТОП АТАУЫ" },
            { number: "2026", label: "ЖЫЛ" },
            { number: "КарГУ", label: "УНИВЕРСИТЕТ" }
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-bg)",
                padding: "clamp(32px, 4vw, 48px)",
                display: "flex",
                flexDirection: "column",
                gap: 8
              }}
            >
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 700,
                color: "var(--color-text)",
                lineHeight: 1
              }}>
                {stat.number}
              </span>
              <span style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)"
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 5: CTA — back to blog ─── */}
      <section style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 24
      }}>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)"
          }}
        >
          Философияны бірге зерттейік
        </p>

        <Link
          href="/category/maqalalar"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 32px",
            border: "1.5px solid #C5401A",
            color: "#C5401A",
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 200ms, color 200ms"
          }}
          className="hover:bg-[#C5401A] hover:text-white"
        >
          ← МАҚАЛАЛАРҒА ОРАЛУ
        </Link>
      </section>

    </main>
  );
}
