"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Menu, Moon, Sun, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTheme } from "@/contexts/ThemeProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

const leftMainLinks = [
  { href: "/about", label: "БІЗ ТУРАЛЫ" },
  { href: "/forum", label: "ФОРУМ" },
];

const rightMainLinks = [
  { href: "/auth/login", label: "КІРУ" },
  { href: "/connect", label: "ЖАЗЫЛУ" },
];

const categories = [
  { label: "МАҚАЛАЛАР", href: "/category/maqalalar" },
  { label: "ЖАҢАЛЫҚТАР", href: "/news" },
  { label: "МАТЕРИАЛДАР", href: "/materials" },
  { label: "ПОДКАСТТАР", href: "/podcasts" },
];

const mobileOverlayLinks = [
  { href: "/", label: "БАСТЫ БЕТ" },
  { href: "/category/maqalalar", label: "МАҚАЛАЛАР" },
  { href: "/about", label: "БІЗ ТУРАЛЫ" },
  { href: "/auth/login", label: "КІРУ" },
  { href: "/connect", label: "ЖАЗЫЛУ" },
];

const navRoutes: Record<string, string> = {
  "БІЗ ТУРАЛЫ": "/about",
  "ФОРУМ": "/forum",
  "КІРУ": "/auth/login",
  "ЖАЗЫЛУ": "/connect",
};

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const MotionLink = motion.create(Link);

function NavCellItem({
  label,
  href,
  activeNav,
  theme,
}: {
  label: string;
  href: string;
  activeNav: string | null;
  theme: string;
}) {
  const isActive = activeNav === label;
  const activeBg = theme === "dark" ? "#ffffff" : "#111111";
  const activeText = theme === "dark" ? "#111111" : "#ffffff";

  return (
    <MotionLink
      href={href}
      prefetch={true}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        padding: "0 32px",
        fontFamily: "var(--font-ui)",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        textDecoration: "none",
        color: isActive ? activeText : "var(--color-text)",
        zIndex: 1,
        cursor: "pointer",
        transition: "color 200ms ease",
      }}
      whileHover={!isActive ? { opacity: 0.6 } : {}}
    >
      {!isActive ? (
        <motion.span
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            height: 1,
            background: "currentColor",
            width: "100%",
            zIndex: 2,
          }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}
      <AnimatePresence>
        {isActive ? (
          <motion.div
            layoutId="nav-active-cell"
            style={{
              position: "absolute",
              inset: 0,
              bottom: -1,
              background: activeBg,
              zIndex: -1,
            }}
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              layout: {
                type: "spring",
                stiffness: 380,
                damping: 38,
              },
            }}
          />
        ) : null}
      </AnimatePresence>
      <span style={{ position: "relative", zIndex: 2 }}>{label}</span>
    </MotionLink>
  );
}

function Logo({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <MotionLink
        href="/"
        prefetch={true}
        className="inline-flex flex-col items-center no-underline"
      >
        <span
          className="font-display text-[32px] font-bold leading-none tracking-[0.04em] text-foreground"
          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
        >
          ZERDE
        </span>
        <svg
          width="18"
          height="10"
          viewBox="0 0 18 10"
          fill="none"
          className="mt-1"
          aria-hidden="true"
        >
          <path d="M9 10L0 0H18L9 10Z" fill="#C5401A" />
        </svg>
      </MotionLink>
    );
  }

  return (
    <MotionLink
      href="/"
      prefetch={true}
      className="inline-flex flex-col items-center no-underline"
    >
      <span
        style={{ fontSize: 60, fontFamily: "Playfair Display, Georgia, serif" }}
        className="font-display font-bold leading-none tracking-[0.04em] text-foreground"
      >
        ZERDE
      </span>
      <div
        style={{
          opacity: 1,
          height: 16,
          overflow: "hidden",
          marginTop: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
          <path d="M9 10L0 0H18L9 10Z" fill="#C5401A" />
        </svg>
      </div>
    </MotionLink>
  );
}

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="transition-colors text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
      style={{
        background: "none",
        border: "none",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex" }}
          >
            <Moon size={15} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex" }}
          >
            <Sun size={15} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function LanguageSwitcher() {
  const [activeLang, setActiveLang] = useState("KAZ");
  const { theme } = useTheme();
  const separatorColor = theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";

  const langs = ["RUS", "KAZ", "ENG"];

  return (
    <div
      className="flex items-center font-ui text-[12px] uppercase text-(--color-text-muted)"
      style={{ letterSpacing: "0.08em" }}
    >
      {langs.map((lang, idx) => (
        <div key={lang} className="flex items-center">
          <motion.button
            type="button"
            onClick={() => setActiveLang(lang)}
            className="relative px-2 py-1 transition-colors"
            style={{
              color: activeLang === lang ? "var(--color-text)" : "var(--color-text-muted)",
              fontWeight: activeLang === lang ? 600 : 400,
            }}
            whileHover={{ opacity: 0.8 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeLang === lang ? (
              <motion.div
                layoutId="active-lang-indicator"
                className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full"
                style={{ background: "#C5401A" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            ) : null}
            {lang}
          </motion.button>
          {idx < langs.length - 1 ? (
            <span style={{ color: separatorColor, margin: "0 2px" }}>|</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function UtilityBar() {
  return (
    <div className="grid h-10 w-full grid-cols-[1fr_1fr_2fr_1fr_1fr]">
      <div className="border-r border-divider" />
      <div className="border-r border-divider" />
      <div className="border-r border-divider" />
      <div className="border-r border-divider" />
      <div className="flex items-center justify-center gap-4">
        <LanguageSwitcher />
        <ThemeButton />
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [syncedAvatarUrl, setSyncedAvatarUrl] = useState<string | null>(null);
  const [syncedFullName, setSyncedFullName] = useState<string | null>(null);
  const { theme } = useTheme();

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const utilityHeight = useTransform(smoothScrollY, [0, 60], [40, 0]);
  const utilityOpacity = useTransform(smoothScrollY, [0, 40], [1, 0]);
  const logoFontSize = useTransform(smoothScrollY, [0, 80], [60, 38]);
  const triangleOpacity = useTransform(smoothScrollY, [0, 50], [1, 0]);
  const triangleHeight = useTransform(smoothScrollY, [0, 50], [16, 0]);
  const headerBgOpacity = useTransform(smoothScrollY, [0, 60], [1, 0.88]);
  const lightHeaderBg = useTransform(headerBgOpacity, (value) => `rgba(255,255,255,${value})`);
  const darkHeaderBg = useTransform(headerBgOpacity, (value) => `rgba(23,22,20,${value})`);

  useEffect(() => {
    return smoothScrollY.on("change", (value) => {
      setIsScrolled(value > 50);
    });
  }, [smoothScrollY]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setAuthUser(null);
      setProfile(null);
      return;
    }

    let isMounted = true;

    const syncAuthState = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user ?? null;

      if (!isMounted) {
        return;
      }

      setAuthUser(user);

      if (!user) {
        setProfile(null);
        setSyncedAvatarUrl(null);
        setSyncedFullName(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id,full_name,avatar_url,user_type,role")
        .eq("id", user.id)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      setProfile(data ?? null);
      setSyncedAvatarUrl(data?.avatar_url ?? null);
      setSyncedFullName(data?.full_name ?? null);
    };

    void syncAuthState();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      void syncAuthState();
    });

    const handleProfileUpdated = (
      event: Event,
    ) => {
      const customEvent = event as CustomEvent<{ avatarUrl?: string | null; fullName?: string | null }>;
      const nextAvatarUrl = customEvent.detail?.avatarUrl;
      const nextFullName = customEvent.detail?.fullName;

      if (typeof nextAvatarUrl !== "undefined") {
        setSyncedAvatarUrl(nextAvatarUrl);
      }

      if (typeof nextFullName !== "undefined") {
        setSyncedFullName(nextFullName);
      }
    };

    window.addEventListener("profile:updated", handleProfileUpdated as EventListener);

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
      window.removeEventListener("profile:updated", handleProfileUpdated as EventListener);
    };
  }, []);

  const avatarInitial =
    syncedFullName?.[0]?.toUpperCase() ?? authUser?.email?.[0]?.toUpperCase() ?? "U";
  const avatarUrl = syncedAvatarUrl;

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const mobileLinks = authUser
    ? [
        { href: "/", label: "БАСТЫ БЕТ" },
        { href: "/category/maqalalar", label: "МАҚАЛАЛАР" },
        { href: "/about", label: "БІЗ ТУРАЛЫ" },
        { href: "/forum", label: "ФОРУМ" },
        { href: "/profile", label: "ПРОФИЛЬ" },
        ...(profile?.role === "admin" ? [{ href: "/admin", label: "АДМИН ПАНЕЛЬ" }] : []),
        { href: "/connect", label: "ЖАЗЫЛУ" },
      ]
    : mobileOverlayLinks;

  const activeNav =
    Object.entries(navRoutes).find(
      ([, route]) => pathname === route || pathname.startsWith(`${route}/`),
    )?.[0] ?? null;

  const activeCategory =
    categories.find((cat) => pathname === cat.href || pathname.startsWith(`${cat.href}/`))?.label ?? null;

  const row2ShadowClass = isScrolled
    ? "backdrop-blur-[16px] shadow-[0_1px_0_#e5e5e5,0_4px_24px_rgba(0,0,0,0.06)]"
    : "backdrop-blur-none shadow-none";

  return (
    <header className="sticky top-0 z-50 overflow-hidden">
      <motion.div
        style={{
          height: utilityHeight,
          opacity: utilityOpacity,
          overflow: "hidden",
        }}
        className="hidden md:block"
      >
        <div className="border-b border-divider" style={{ background: "var(--color-bg)" }}>
          <div className="mx-auto max-w-350 border-x border-divider">
            <UtilityBar />
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{
          background: "var(--color-bg)",
          backgroundColor: theme === "dark" ? darkHeaderBg : lightHeaderBg,
          position: "relative",
          zIndex: 100,
        }}
        className={`border-b border-divider transition-shadow duration-300 ${row2ShadowClass}`}
      >
        <div
          className="mx-auto hidden h-24 max-w-350 border-x border-divider md:flex"
          style={{ overflow: "visible" }}
        >
          <div
            className="flex flex-1 border-r border-divider"
            style={{ alignItems: "stretch", height: "100%", overflow: "visible" }}
          >
            <NavCellItem
              href={leftMainLinks[0].href}
              label={leftMainLinks[0].label}
              activeNav={activeNav}
              theme={theme}
            />
          </div>

          <div
            className="flex flex-1 border-r border-divider"
            style={{ alignItems: "stretch", height: "100%", overflow: "visible" }}
          >
            <NavCellItem
              href={leftMainLinks[1].href}
              label={leftMainLinks[1].label}
              activeNav={activeNav}
              theme={theme}
            />
          </div>

          <div
            className="relative flex flex-2 flex-col items-center justify-center border-r border-divider"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            <MotionLink
              href="/"
              prefetch={true}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <motion.span
                style={{
                  fontSize: logoFontSize,
                  fontFamily: "Playfair Display, Georgia, serif",
                }}
                className="font-display font-bold leading-none tracking-[0.04em] text-foreground"
              >
                ZERDE
              </motion.span>
            </MotionLink>
            <motion.button
              type="button"
              onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
              className="mt-1 flex cursor-pointer items-center justify-center border-none bg-transparent p-1"
              style={{
                opacity: triangleOpacity,
                height: triangleHeight,
                overflow: "hidden",
              }}
              aria-expanded={isCategoryDropdownOpen}
              aria-label="Toggle categories"
            >
              <motion.svg
                width="18"
                height="10"
                viewBox="0 0 18 10"
                fill="none"
                aria-hidden="true"
                animate={{ rotate: isCategoryDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path d="M9 10L0 0H18L9 10Z" fill="#C5401A" />
              </motion.svg>
            </motion.button>
          </div>

          <div
            className="relative flex flex-1 border-r border-divider"
            style={{ alignItems: "stretch", height: "100%", overflow: "visible" }}
          >
            {authUser ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link href="/profile" prefetch={true} style={{ display: "flex", alignItems: "center" }}>
                  <div
                    role="img"
                    aria-label="avatar"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 13,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "2px solid var(--color-border)",
                      background: "var(--color-surface-2)",
                    }}
                  >
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        width={44}
                        height={44}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "var(--color-surface-offset)",
                          color: "var(--color-text)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          fontWeight: 700,
                        }}
                      >
                        {avatarInitial}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <NavCellItem
                href={rightMainLinks[0].href}
                label={rightMainLinks[0].label}
                activeNav={activeNav}
                theme={theme}
              />
            )}
          </div>

          <div
            className="relative flex flex-1"
            style={{ alignItems: "stretch", height: "100%", overflow: "visible" }}
          >
            <NavCellItem
              href={rightMainLinks[1].href}
              label={rightMainLinks[1].label}
              activeNav={activeNav}
              theme={theme}
            />
          </div>
        </div>

        <div className="grid h-24 grid-cols-[1fr_auto_1fr] items-center px-4 md:hidden">
          <div aria-hidden="true" className="h-8.5 w-8.5" />
          <div className="justify-self-center">
            <Logo mobile />
          </div>
          <div className="justify-self-end">
            <div className="flex items-center gap-2">
              <ThemeButton />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-transparent text-foreground transition-colors duration-150 ease-in-out hover:bg-surface-2"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {isCategoryDropdownOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
            style={{ position: "relative", zIndex: 99 }}
          >
            <nav
              aria-label="Category navigation"
              className="h-10 border-b border-divider transition-colors duration-300 xl:h-12"
              style={{ background: "var(--color-bg)" }}
            >
              <div className="mx-auto flex h-full max-w-350 border-x border-divider">
                <div
                  className="flex flex-1 items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {categories.map(({ label, href }) => {
                    const isActive = label === activeCategory;
                    const isHovered = label === hoveredCategory;

                    const textColor = isActive
                      ? "var(--color-bg)"
                      : "var(--color-text-muted)";

                    return (
                      <MotionLink
                        key={label}
                        href={href}
                        prefetch={true}
                        onMouseEnter={() => setHoveredCategory(label)}
                        className="relative flex flex-1 items-center justify-center border-r border-divider px-3 font-ui text-[11px] font-medium tracking-widest uppercase transition-colors last:border-r-0 no-underline xl:text-[12px]"
                        style={{
                          color: textColor,
                          background: "transparent",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isHovered && !isActive ? (
                          <motion.div
                            layoutId="category-hover-bg"
                            className="absolute inset-0 z-[-2]"
                            style={{
                              background:
                                theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                            }}
                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          />
                        ) : null}
                        {isActive ? (
                          <motion.div
                            layoutId="category-active-bg"
                            className="absolute inset-0 z-0"
                            style={{ background: "var(--color-text)" }}
                            transition={{ type: "spring", stiffness: 380, damping: 35 }}
                          />
                        ) : null}
                        <span className="relative z-10">{label}</span>
                      </MotionLink>
                    );
                  })}
                </div>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-100 flex flex-col"
            style={{ background: "var(--color-bg)" }}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Logo mobile />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-transparent text-foreground transition-colors duration-150 ease-in-out hover:bg-surface-2"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="h-px bg-divider" />

            <nav className="flex flex-col">
              {mobileLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.24, delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block border-b border-divider px-6 py-4 font-display text-[28px] leading-[1.05] text-foreground no-underline"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {authUser ? (
                <motion.div
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.24, delay: mobileLinks.length * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      void handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full border-b border-divider px-6 py-4 font-display text-left text-[28px] leading-[1.05] text-foreground"
                    style={{ background: "transparent" }}
                  >
                    ШЫҒУ
                  </button>
                </motion.div>
              ) : null}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
