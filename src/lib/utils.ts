import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

/** Absolute TR date — stable across SSR/CSR */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Relative label from a fixed "now".
 */
export function formatRelativeTo(iso: string, nowMs: number): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Math.max(0, nowMs - d.getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Az önce";
  if (min < 60) return `${min} dakika önce`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} saat önce`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "Dün";
  if (day < 7) return `${day} gün önce`;
  return formatDate(iso);
}

/**
 * Safe for SSR + static prerender: absolute date so HTML matches hydrate
 * (prevents React #418 clock drift).
 */
export function formatRelative(iso: string): string {
  return formatDate(iso);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
