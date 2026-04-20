"use client";

import { useEffect } from "react";
import Image from "next/image";

const strategies = [
  "Әлеуметтік желілердегі медиа контентті кәсіби деңгейге көтеру",
  "Факультет блогерлерімен серіктестік орнату",
  "Жобаларды тиімді жарнамалау",
  "Философия және психология факультетін Қарағандыдан тыс аймақтарда таныту",
  "Жас философтар арасында тұрақты қауымдастық қалыптастыру",
  "Философияға прогрессивті пікірлер мен жаңа көзқарастар ұсыну",
];

const team = [
  { role: "Куратор", name: "Marat Zhumageldinov" },
  { role: "Редактор", name: "Al-Farabi Tusup" },
  { role: "Контент координаторы", name: "Daniyar Bekbol" },
  { role: "Қауымдастық менеджері", name: "Aigerim Nurtai" },
];

export default function AboutPage() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page-shell">
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
            <p className="about-hero-subtitle">Студенттік философия платформасы</p>
          </div>
        </div>

        <div className="about-hero-bottomline">
          <p className="about-hero-note">Ойлау, пікірталас және интеллектуалдық қауымдастық кеңістігі</p>

          <div className="about-scroll-indicator" aria-hidden="true">
            <span>ТӨМЕН</span>
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

      <section className="about-mission-section reveal">
        <div className="about-mission-label">ЖОБА МАҚСАТЫ</div>
        <div className="about-mission-text">
          <p>
            Біздің жоба – Қазақстанның түкпір-түкпіріндегі философия студенттерін біріктіретін заманауи
            онлайн-платформа құруға бағытталған.
          </p>
          <p>
            Сайттың негізгі мақсаты – студенттер арасында тұрақты байланыс орнатып, ортақ интеллектуалдық
            кеңістік қалыптастыру. Платформа арқылы қатысушылар академиялық материалдармен алмасып,
            пікірталастар ұйымдастырып, бірлескен жобаларды жүзеге асыра алады.
          </p>
          <p>
            Бұл жоба әртүрлі университет студенттері арасындағы ынтымақтастықты күшейтіп, философиялық ойлау
            мен кәсіби дамуға қолайлы орта ұсынады.
          </p>
        </div>
      </section>

      <section className="about-quote-section reveal">
        <div className="about-quote-inner">
          <span className="about-section-label about-quote-label">ФИЛОСОФИЯ ДЕГЕН НЕ?</span>
          <span className="about-quote-mark">&quot;</span>
          <blockquote className="about-quote-text">
            Философия деген – даналықпен айналысу ғана емес, сонымен қатар соған деген құштарлық пен махаббат.
          </blockquote>
          <p className="about-quote-text-secondary">
            Бұл – ойлауға, елестетуге және дүниені тереңірек түсінуге мүмкіндік беретін еркін кеңістік.
          </p>
        </div>
      </section>

      <section className="about-strategy-section reveal">
        <div className="about-strategy-header reveal">
          <span className="about-section-label">БІЗДІҢ СТРАТЕГИЯМЫЗ</span>
        </div>
        <div className="about-strategy-list">
          {strategies.map((item, i) => (
            <div key={item} className="strategy-item reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="strategy-num">{String(i + 1).padStart(2, "0")}</span>
              <p className="strategy-text">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-us-section reveal">
        <div className="about-us-text">
          <span className="about-section-label">БІЗ ТУРАЛЫ</span>
          <h2 className="about-us-heading">Ф-23-1К</h2>
          <div className="about-us-body">
            <p>
              Біз – Е.А.Бөкетов атындағы Қарағанды университетінің Философия және психология факультетінде білім
              алып жүрген Ф-23-1К тобының 3 курс студенттеріміз.
            </p>
            <p>
              Біздің топтың ерекшелігі – шағын әрі бірегей құрамда болуымыз. Бұл бізге өзара тығыз
              интеллектуалдық байланыс орнатып, ортақ идеяларды бірлесіп дамытуға мүмкіндік береді.
            </p>
            <p>
              Кураторымыз – <strong>Марат Жұмагельдинов.</strong> Біздің оқу бағдарымыз классикалық философияны,
              білімге деген құштарлықты және заманауи қоғамға ашық интеллектуалдық ұстанымды негізге алады.
            </p>
          </div>
          <div className="about-us-meta">
            <span>Е.А.Бөкетов атындағы КарГУ</span>
            <span>·</span>
            <span>Қарағанды, 2026</span>
          </div>
        </div>

        <div className="about-us-image-wrap">
          <Image
            src="https://pplx-res.cloudinary.com/image/upload/pplx_search_images/f16b530876b942db713e40be67a59ae16c4614d3.jpg"
            alt="Е.А.Бөкетов атындағы Қарағанды университеті"
            className="about-us-image"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        </div>
      </section>

      <section className="about-team-section reveal">
        <div className="about-team-header">
          <span className="about-section-label">КОМАНДА</span>
        </div>
        <div className="about-team-grid">
          {team.map((member) => (
            <div key={member.name} className="team-member">
              <div className="team-role">{member.role}</div>
              <div className="team-name">{member.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
