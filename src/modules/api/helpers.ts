import type {
  RetrieveFileExtensionOptions,
  UploadsFile,
} from "@/src/@types/database";
import type { ForcedValue } from "@/src/@types/helpers";
import {
  uploadsCategoryConfig,
  allowedFileExtensions,
} from "@/src/lib/config/files";

export function getCategoryKey(category: string): string {
  return category.includes("/") ? `${category.split("/").at(0)}/` : category;
}

export function retrieveAvailableFileExtensions<Force extends boolean = false>(
  file: RetrieveFileExtensionOptions,
  force?: Force
): ForcedValue<string[], Force> {
  const { category } = file;
  const categoryData = uploadsCategoryConfig[getCategoryKey(category)];

  if (!categoryData) {
    if (force) throw new Error("Invalid Category");
    return undefined as ForcedValue<string[], Force>;
  }

  const { type } = categoryData;
  const extension = allowedFileExtensions[type];
  return extension as unknown as ForcedValue<string[], Force>;
}

export function retrieveFileExtension<Force extends boolean = false>(
  file: RetrieveFileExtensionOptions,
  force?: Force
): ForcedValue<string, Force> {
  const { category } = file;
  const categoryData = uploadsCategoryConfig[getCategoryKey(category)];

  if (!categoryData) {
    if (force) throw new Error("Invalid Category");
    return undefined as ForcedValue<string, Force>;
  }

  const { type } = categoryData;
  const extension = allowedFileExtensions[type].at(0)!;
  return extension as ForcedValue<string, Force>;
}

export function retrieveFullFilename<Force extends boolean>(
  file: UploadsFile,
  force?: Force
): ForcedValue<string, Force> {
  const extension = retrieveFileExtension(file, force);

  if (!extension) return undefined as ForcedValue<string, Force>;

  const id = file.id;
  return `${id}.${extension}` as ForcedValue<string, Force>;
}
