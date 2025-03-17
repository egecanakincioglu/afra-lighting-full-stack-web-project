import type {
  UploadsFile,
  RequestResult,
  SuccessfulRequestResult,
  UploadsFilePostResult,
  UploadsFilePatchResult,
  APIPatchNewFile,
} from "@/src/@types/database";
import {
  retrieveFullFilename,
  getCategoryKey,
  retrieveAvailableFileExtensions,
  retrieveFileExtension,
} from "@/src/modules/api/helpers";
import { getFilePath, getUploadFilePath } from "@/src/modules/helpers/files";
import {
  createDefaultHandler,
  errorMessages,
  generateId,
} from "@/src/modules/api/handler";
import { metadataDB } from "@/src/modules/database/exports";
import { isString, isNumber } from "@/src/lib/helpers/verifications";
import { verifyUser } from "@/src/modules/database/events/verifyUser";
import { uploadsCategoryConfig } from "@/src/lib/config/files";
import { removeNullishValues } from "@/src/lib/helpers/objects";
import {
  productsUploadsMetadata,
  baseUploadsMetadata,
} from "@/src/modules/api/schemas";
import { writeFile, rm } from "fs/promises";
import type { NextApiRequest } from "next";
import sharp from "sharp";
import getRawBody from "raw-body";
import { UploadPatchRequest, UploadPostRequest } from "@/src/lib/protos/upload";
import { fileTypeFromBuffer } from "file-type";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function patchHandlerMiddleware(
  req: NextApiRequest
): Promise<RequestResult> {
  try {
    const { cookies } = req;
    const { status } = await verifyUser(cookies.sessionToken);

    if (!status) return errorMessages.unauthorized;

    const isUploading = metadataDB.getKey("isUploading");

    if (isUploading)
      return {
        ...errorMessages.badRequest,
        message: "Another upload is ongoing.",
      };

    metadataDB.setKey("isUploading", true);

    const raw = await getRawBody(req, { limit: "100mb" });
    const data = UploadPatchRequest.fromBinary(raw);
    const { files } = data;
    const allFiles = metadataDB.getKey("files") ?? [];

    const movedFiles = [];
    const newFiles: APIPatchNewFile[] = [];

    let error: RequestResult | undefined;

    for (const fileData of files) {
      const { file, index, metadata, id: oldId } = fileData;

      const databaseFile = allFiles.find((item) => item.id === oldId);

      if (!databaseFile) {
        error = errorMessages.badRequest;
        break;
      }

      const { category, metadata: oldMetadata, index: oldIndex } = databaseFile;

      const finalCategory = getCategoryKey(category);
      const categoryData = uploadsCategoryConfig[finalCategory];

      if (!categoryData) {
        error = errorMessages.badRequest;
        break;
      }

      const { type, maxCount } = categoryData;

      if (isNumber(index) && isNumber(maxCount) && maxCount - 1 < index) {
        error = errorMessages.badRequest;
        break;
      }

      const categoryMetadataVerifier = category.startsWith("products/")
        ? productsUploadsMetadata
        : baseUploadsMetadata;

      const cleanedMetadata = {
        ...removeNullishValues(oldMetadata, [""]),
        ...removeNullishValues(metadata, [""]),
      };

      const parsedMetadata =
        categoryMetadataVerifier.safeParse(cleanedMetadata);

      if (!parsedMetadata.success) {
        error = errorMessages.badRequest;
        break;
      }

      const finalMetadata = removeNullishValues(parsedMetadata.data, [""]);

      const newFile: APIPatchNewFile = {
        newFile: {
          ...databaseFile,
          index: index ?? oldIndex,
        },
      };

      if (Object.keys(finalMetadata).length > 0)
        newFile.newFile.metadata = finalMetadata;

      if (file) {
        const fileType = await fileTypeFromBuffer(file);

        if (!fileType) {
          error = errorMessages.badRequest;
          break;
        }

        const extensions = retrieveAvailableFileExtensions({ category });

        if (!extensions?.includes(fileType.ext)) {
          error = errorMessages.badRequest;
          break;
        }

        const id = generateId();
        const extension = retrieveFileExtension({ category }, true);

        try {
          const finalBuffer = await (type === "image"
            ? sharp(file).webp().toBuffer()
            : file);
          const finalFilename = `${id}.${extension}`;
          const uploadPath = getUploadFilePath(finalFilename);

          await writeFile(uploadPath, finalBuffer);

          movedFiles.push({
            oldFilename: retrieveFullFilename(databaseFile, true),
            newFilename: finalFilename,
          });

          newFile.oldId = oldId;
          newFile.newFile.id = id;

          newFiles.push(newFile);
        } catch (error) {
          console.log(error);
          error = errorMessages.internal;
          break;
        }
      } else {
        newFiles.push(newFile);
      }
    }

    const finalNewFiles = newFiles.map(({ newFile }) => newFile);

    const finalFiles = allFiles.map(
      (item) =>
        newFiles.find((i) => (i.oldId ?? i.newFile.id) === item.id)?.newFile ??
        item
    );

    const sameIndex = finalFiles.some(
      (item, index) =>
        finalFiles.findLastIndex(
          (i) => item.index === i.index && item.category === i.category
        ) !== index
    );

    if (sameIndex) {
      error = {
        ...errorMessages.badRequest,
        message: "Cannot use two equal indexes in same category.",
      };
    }

    if (error) {
      for (const { newFilename } of movedFiles) {
        await rm(getUploadFilePath(newFilename));
      }

      return error;
    } else {
      for (const { oldFilename } of movedFiles) {
        await rm(getUploadFilePath(oldFilename));
      }
    }

    metadataDB.setKey("files", finalFiles);

    return {
      status: true,
      data: {
        updatedFiles: finalNewFiles,
        files: finalFiles,
      },
    } satisfies SuccessfulRequestResult<UploadsFilePatchResult>;
  } catch (error) {
    console.log(error);
    return errorMessages.internal;
  }
}

async function postHandlerMiddleware(
  req: NextApiRequest
): Promise<RequestResult> {
  try {
    const { cookies } = req;
    const { status } = await verifyUser(cookies.sessionToken);

    if (!status) return errorMessages.unauthorized;

    const isUploading = metadataDB.getKey("isUploading");

    if (isUploading)
      return {
        ...errorMessages.badRequest,
        message: "Another upload is ongoing.",
      };

    metadataDB.setKey("isUploading", true);

    const raw = await getRawBody(req, { limit: "100mb" });
    const data = UploadPostRequest.fromBinary(raw);
    const { files } = data;
    const allFiles = metadataDB.getKey("files") ?? [];
    const movedFiles: {
      data: UploadsFile;
      filename?: string;
    }[] = [];
    let error: RequestResult | undefined;

    for (const fileData of files) {
      const { file, metadata: rawMetadata, category, index } = fileData;

      const finalCategory = getCategoryKey(category);
      const categoryData = uploadsCategoryConfig[finalCategory];

      if (!file || !categoryData) {
        error = errorMessages.badRequest;
        break;
      }

      const { type, maxCount } = categoryData;

      if (isNumber(maxCount) && maxCount - 1 < index) {
        error = errorMessages.badRequest;
        break;
      }

      const fileType = await fileTypeFromBuffer(file);

      if (!fileType) {
        error = errorMessages.badRequest;
        break;
      }

      const extensions = retrieveAvailableFileExtensions({ category });

      if (!extensions?.includes(fileType.ext)) {
        error = errorMessages.badRequest;
        break;
      }

      const sameIndex = allFiles.find(
        (item) => item.index === index && item.category === category
      );

      if (sameIndex && category !== "logo") {
        error = {
          ...errorMessages.badRequest,
          message: "Cannot use two equal indexes in same category.",
        };
        break;
      }

      const categoryMetadataVerifier = category.startsWith("products/")
        ? productsUploadsMetadata
        : baseUploadsMetadata;

      const parsedMetadata = categoryMetadataVerifier.safeParse(rawMetadata);

      if (!parsedMetadata.success) {
        error = errorMessages.badRequest;
        break;
      }

      const metadata = removeNullishValues(parsedMetadata.data, [""]);
      const id = generateId();
      const extension = retrieveFileExtension({ category }, true);

      const finalFileData = {
        id,
        index,
        category,
        ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
      } satisfies UploadsFile;

      try {
        const finalBuffer = await (type === "image"
          ? sharp(file).webp().toBuffer()
          : file);

        if (category === "logo") {
          const uploadPath = getFilePath("public", "main-logo.webp");
          await writeFile(uploadPath, finalBuffer, { flag: "w" });

          continue;
        }

        const finalFilename = `${id}.${extension}`;
        const uploadPath = getUploadFilePath(finalFilename);

        await writeFile(uploadPath, finalBuffer);

        movedFiles.push({
          data: finalFileData,
          filename: finalFilename,
        });
      } catch (error) {
        console.log(error);
        error = errorMessages.internal;
        break;
      }
    }

    if (error) {
      for (const { filename } of movedFiles) {
        if (filename) await rm(filename);
      }

      return error;
    }

    const newFiles = movedFiles.map(({ data }) => data);
    const finalFiles = [...allFiles, ...newFiles];

    if (newFiles.length) metadataDB.setKey("files", finalFiles);

    return {
      status: true,
      data: {
        newFiles,
        files: finalFiles,
      },
    } satisfies SuccessfulRequestResult<UploadsFilePostResult>;
  } catch (error) {
    console.log(error);
    return errorMessages.internal;
  }
}

export async function deleteCategories(
  categories: string
): Promise<RequestResult> {
  const expandedCategories = categories.split(",");
  const db = metadataDB.getKey("files") ?? [];

  const data = expandedCategories.reduce<UploadsFile[]>(
    (total, current) => [
      ...total,
      ...db.filter((file) => file.category === current),
    ],
    []
  );

  try {
    for (const file of data) {
      const filename = retrieveFullFilename(file, true);
      await rm(getUploadFilePath(filename));
    }
  } catch (error) {
    console.log(error);
    return errorMessages.internal;
  }

  metadataDB.setKey(
    "files",
    db.filter((item) => !data.some((i) => i.id === item.id))
  );

  return { status: true };
}

export default createDefaultHandler({
  async post(req) {
    const result = await postHandlerMiddleware(req);

    if (!("code" in result && result.code === 401)) {
      metadataDB.deleteKey("isUploading");
    }

    return result;
  },
  async patch(req) {
    const result = await patchHandlerMiddleware(req);

    if (!("code" in result && result.code === 401)) {
      metadataDB.deleteKey("isUploading");
    }

    return result;
  },
  async delete(req) {
    const { cookies } = req;
    const { status } = await verifyUser(cookies.sessionToken);

    if (!status) return errorMessages.unauthorized;

    const isUploading = metadataDB.getKey("isUploading");

    if (isUploading)
      return {
        ...errorMessages.badRequest,
        message: "Another upload is ongoing.",
      };

    metadataDB.setKey("isUploading", true);

    const items = req.query;
    const { categories } = items;

    if (!isString(categories)) return errorMessages.badRequest;

    const result = await deleteCategories(categories);
    metadataDB.deleteKey("isUploading");
    return result;
  },
  async get(req) {
    const items = req.query;
    const { categories } = items;

    if (isString(categories)) {
      const expandedCategories = categories.split(",");
      const db = metadataDB.getKey("files") ?? [];

      const allCategories = Object.keys(uploadsCategoryConfig);

      const data = expandedCategories.reduce<Record<string, UploadsFile[]>>(
        (total, current) => ({
          ...total,
          [current]: allCategories.find(
            (category) => category === `${current}/`
          )
            ? db.filter((file) => file.category.startsWith(`${current}/`))
            : db.filter((file) => file.category === current),
        }),
        {}
      );

      return { status: true, data };
    } else if (Object.keys(items).length === 0) {
      const db = metadataDB.getKey("files") ?? [];

      const data = db.reduce<Record<string, UploadsFile[]>>(
        (total, current) => {
          const { category } = current;

          return {
            ...total,
            [category]: [...(total[category] ?? []), current],
          };
        },
        {}
      );

      return { status: true, data };
    } else {
      return { status: false, message: "Bad Request" };
    }
  },
});
