import { regionCodes, defaultRegionCode } from "../config/strings";

export function parseWhatsAppNumber(url: string): string | null {
  const regex = /wa\.me\/\d+/;
  const match = url.match(regex);

  return match ? match[0].split("/")[1] : null;
}

export function stylePhoneNumber(number: string): string {
  const trimmedNumber = number.trim().replaceAll(" ", "");

  const regionCodeMatch = regionCodes.find((code) =>
    trimmedNumber.startsWith(code)
  );
  const rest = regionCodeMatch
    ? trimmedNumber.slice(regionCodeMatch.length)
    : trimmedNumber;

  if (rest.length < 10) return "Hatalı Numara";

  const code = rest.slice(0, 3);
  const middle = rest.slice(3, 6);
  const lastStart = rest.slice(6, 8);
  const lastEnd = rest.slice(8, 10);

  return `${defaultRegionCode} (${code}) ${middle} ${lastStart} ${lastEnd}`;
}

export function normalizeIP(ip: string): string {
  return ip.startsWith("::ffff:") ? ip.substring(7) : ip;
}

export function isLocalIP(ip: string): boolean {
  return ["::1", "127.0.0.1"].includes(ip);
}
