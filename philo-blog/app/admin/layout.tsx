import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Protected by middleware.ts — redirects to /auth/login if not admin
  return <AdminShell>{children}</AdminShell>;
}
