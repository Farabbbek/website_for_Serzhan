import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Редакция" },
  { href: "/", label: "Манифест" },
  { href: "/", label: "Архив" },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--color-divider)]">
      <div className="editorial-shell py-8 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="editorial-stack">
            <p className="eyebrow">Philo Blog</p>
            <p className="max-w-2xl text-[length:var(--text-sm)] text-[color:var(--color-text-muted)]">
              Философиялық эссе, қоғамдық ой және цифрлық дәуірдегі гуманитарлық
              сұрақтар туралы редакциялық алаң.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-4 md:justify-end">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex min-h-11 items-center text-[length:var(--text-sm)] font-medium text-[color:var(--color-text-muted)] no-underline transition-colors hover:text-[color:var(--color-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
