import { getProjectDir } from "@/src/lib/config/files";
import { join } from "path";

export const tempUploadDir = getFilePath("server", "temp");

export function getFilePath(...path: string[]): string {
  const dir = getProjectDir();
  return join(dir, ...path);
}

export function getUploadFilePath(...path: string[]) {
  return getFilePath("server", "uploads", ...path);
}

export function getTempUploadFilePath(...path: string[]) {
  return getFilePath("server", "temp", ...path);
}
