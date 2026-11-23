"use client";

import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="grow flex flex-col min-h-screen">{children}</main>;
  }

  return (
    <>
      {navbar}
      <main className="grow">{children}</main>
      {footer}
    </>
  );
}
