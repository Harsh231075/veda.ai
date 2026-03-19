"use client";

import { usePathname } from "next/navigation";

const TITLE_BY_PREFIX: Array<{ prefix: string; title: string }> = [
  { prefix: "/assignments/create", title: "Create Assignment" },
  { prefix: "/assignments/output", title: "Generated Assessment" },
  { prefix: "/assignments", title: "Assignments" },
  { prefix: "/ai-toolkit", title: "AI Teacher’s Toolkit" },
  { prefix: "/groups", title: "My Groups" },
  { prefix: "/library", title: "Library" },
  { prefix: "/profile", title: "Profile" },
  { prefix: "/settings", title: "Settings" },
  { prefix: "/", title: "Dashboard" },
];

function titleCaseFromPath(pathname: string): string {
  const cleaned = pathname.split("?")[0].split("#")[0];
  const parts = cleaned.split("/").filter(Boolean);
  if (parts.length === 0) return "Dashboard";

  const last = parts[parts.length - 1]
    .replace(/[-_]+/g, " ")
    .trim();

  if (!last) return "Dashboard";

  return last
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getPageTitle(pathname: string | null | undefined): string {
  const path = pathname ?? "/";

  // match the longest prefix first
  const match = [...TITLE_BY_PREFIX]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((r) => path === r.prefix || path.startsWith(r.prefix + "/"));

  return match?.title ?? titleCaseFromPath(path);
}

export default function usePageTitle(explicitTitle?: string): string {
  const pathname = usePathname();
  return explicitTitle?.trim() ? explicitTitle : getPageTitle(pathname);
}
