import type {
  UploadsCategoriesDeleteSchema,
  UploadsCategoriesPatchSchema,
  UploadsCategoriesPostSchema,
  UploadsFilePatchSchema,
  UploadsFilePostSchema,
} from "@/src/modules/api/schemas";
import type {
  ProductCategory,
  ProductCategoryData,
  SuccessfulRequestResult,
  UploadsCategoryMap,
  UploadsFilePatchResult,
  UploadsFilePostResult,
  UploadsTextsData,
} from "../../@types/database";
import type { SEOConfig } from "../../@types/seo";
import { parseRequestResult } from "./objects";
import { UploadPatchRequest, UploadPostRequest } from "../protos/upload";

export async function deleteUploadsFile(id: string): Promise<true | string> {
  const response = await parseRequestResult(
    await fetch(getUploadAPIFilePath(id), {
      method: "DELETE",
    })
  );

  return response.status ? true : response.message;
}

export async function patchUploadsFiles(
  options: UploadsFilePatchSchema[]
): Promise<UploadsFilePatchResult | string> {
  const mappedFiles = [];

  for (const option of options) {
    const { file, ...others } = option;

    const fileBuffer = file
      ? new Uint8Array(await file.arrayBuffer())
      : undefined;

    const finalOptions = fileBuffer ? { ...others, file: fileBuffer } : others;
    mappedFiles.push(finalOptions);
  }

  const data = UploadPatchRequest.create({ files: mappedFiles });
  const binaryData = UploadPatchRequest.toBinary(data);

  const result = await parseRequestResult<UploadsFilePatchResult>(
    await fetch(getAPIPath("uploads/files"), {
      method: "PATCH",
      body: binaryData,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    })
  );

  return result.status ? result.data! : result.message;
}

export async function postUploadsFiles(
  options: UploadsFilePostSchema[]
): Promise<UploadsFilePostResult | string> {
  const files = [];

  for (const option of options) {
    const { file, ...others } = option;
    const fileBuffer = file
      ? new Uint8Array(await file.arrayBuffer())
      : undefined;

    const finalOptions = fileBuffer ? { ...others, file: fileBuffer } : others;
    files.push(finalOptions);
  }

  const data = UploadPostRequest.create({ files });
  const binaryData = UploadPostRequest.toBinary(data);

  const result = await parseRequestResult<UploadsFilePostResult>(
    await fetch(getAPIPath("uploads/files"), {
      method: "POST",
      body: binaryData,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    })
  );

  return result.status ? result.data! : result.message;
}

export async function getProductCategories(): Promise<ProductCategoryData> {
  const response = await parseRequestResult<ProductCategoryData>(
    await fetch(getAPIPath("uploads/products"))
  );

  return response.status ? response.data! : [];
}

export async function postProductCategories(
  categoryData: UploadsCategoriesPostSchema
): Promise<ProductCategory | undefined> {
  try {
    const response = await fetch(getAPIPath("uploads/products"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) return;

    const { data } =
      (await response.json()) as SuccessfulRequestResult<ProductCategory>;

    return data;
  } catch {
    return;
  }
}

export async function deleteProductCategories(
  deleteData: UploadsCategoriesDeleteSchema
): Promise<boolean> {
  try {
    const response = await fetch(getAPIPath("uploads/products"), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deleteData),
    });

    if (!response.ok) return false;

    return true;
  } catch {
    return false;
  }
}

export async function patchProductCategories(
  patchData: UploadsCategoriesPatchSchema
): Promise<boolean> {
  try {
    const response = await fetch(getAPIPath("uploads/products"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchData),
    });

    if (!response.ok) return false;

    return true;
  } catch {
    return false;
  }
}

export async function verifyUserFromAPI(
  sessionToken: string | undefined
): Promise<boolean> {
  if (!sessionToken) return false;

  const response = await fetch(getAPIPath("verifyUser"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken }),
  });

  return response.ok;
}

export async function getUploadsSEO(): Promise<SEOConfig> {
  try {
    const response = await fetch(getAPIPath(`uploads/seo`));

    if (!response.ok) {
      throw new Error("Invalid Response");
    }

    const { data } =
      (await response.json()) as SuccessfulRequestResult<SEOConfig>;

    if (!data) {
      throw new Error("Invalid Response");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Unexpected Error");
  }
}

export async function getUploadsTexts(): Promise<UploadsTextsData> {
  const empty = {};

  try {
    const response = await fetch(getAPIPath("uploads/texts"));

    if (!response.ok) return empty;

    const { data } =
      (await response.json()) as SuccessfulRequestResult<UploadsTextsData>;

    return data ?? empty;
  } catch {
    return empty;
  }
}

export async function getUploadsCategories<Key extends string>(
  ...categories: Key[]
): Promise<UploadsCategoryMap<Key>> {
  const emptyMap = categories.reduce(
    (total, current) => ({
      ...total,
      [current]: [],
    }),
    []
  ) as UploadsCategoryMap<Key>;

  const response = await parseRequestResult<UploadsCategoryMap<Key>>(
    await fetch(getAPIPath(`uploads/files?categories=${categories.join(",")}`))
  );

  return response.status ? response.data ?? emptyMap : emptyMap;
}

export function getAPIPath(path: string): string {
  return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
}

export function getUploadAPIFilePath(id: string): string {
  return getAPIPath(`uploads/files/${id}`);
}
