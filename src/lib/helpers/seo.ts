import type { SEOReplaceOptions } from "../../@types/seo";

export function replaceAlt(input: string, alt: string): string {
  return input.replace(/\{alt\}/g, alt);
}

export function replaceName(input: string, name: string): string {
  return input.replace(/\{name\}/g, name);
}

export function replaceEmail(input: string, email: string): string {
  return input.replace(/\{email\}/g, email);
}

export function replacePhone(input: string, phone: string): string {
  return input.replace(/\{phone\}/g, phone);
}

export function replaceStyle(input: string, style: string): string {
  return input.replace(/\{style\}/g, style);
}

export const seoReplacerMap = {
  alt: replaceAlt,
  name: replaceName,
  email: replaceEmail,
  phone: replacePhone,
  style: replaceStyle,
} as const;

export function seoTextReplacer(
  input: string,
  options: Partial<SEOReplaceOptions>
): string {
  return Object.entries(options).reduce(
    (acc, [key, value]) =>
      seoReplacerMap[key as keyof SEOReplaceOptions](acc, value as string),
    input
  );
}
