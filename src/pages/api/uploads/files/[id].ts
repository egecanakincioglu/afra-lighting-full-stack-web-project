import { retrieveFullFilename } from "@/src/modules/api/helpers";
import { getUploadFilePath } from "@/src/modules/helpers/files";
import { createDefaultHandler, errorMessages } from "@/src/modules/api/handler";
import { metadataDB } from "@/src/modules/database/exports";
import { isString } from "@/src/lib/helpers/verifications";
import { verifyUser } from "@/src/modules/database/events/verifyUser";
import { existsSync } from "fs";
import { readFile, rm } from "fs/promises";
import type { PageConfig } from "next";
import type { UploadsFile } from "@/src/@types/database";

export const config: PageConfig = {
  api: {
    responseLimit: false,
  },
};

export default createDefaultHandler({
  async get(req, res) {
    const { id } = req.query;

    if (!isString(id)) return errorMessages.badRequest;

    const fileData = (metadataDB.getKey("files") ?? []).find(
      (item) => item.id === id
    );

    if (!fileData) return errorMessages.badRequest;

    const filename = retrieveFullFilename(fileData);

    if (!filename) return errorMessages.internal;

    const filePath = getUploadFilePath(filename);

    if (!existsSync(filePath)) return errorMessages.internal;

    res.setHeaders(
      new Headers({
        "Cache-Control": "public, max-age=31536000, immutable",
      })
    );
    const file = await readFile(filePath);
    res.send(file);
    return { status: true };
  },
  async delete(req) {
    const { cookies } = req;
    const { status } = await verifyUser(cookies.sessionToken);

    if (!status) return errorMessages.unauthorized;

    const { id } = req.query;

    if (!isString(id)) return errorMessages.badRequest;

    const isUploading = metadataDB.getKey("isUploading");

    if (isUploading)
      return {
        ...errorMessages.badRequest,
        message: "Another upload is ongoing.",
      };

    metadataDB.setKey("isUploading", true);

    const files = metadataDB.getKey("files") ?? [];
    const file = files.find((item) => item.id === id);
    const result = await deleteFile(file, files);

    metadataDB.deleteKey("isUploading");

    return result;
  },
});

async function deleteFile(file: UploadsFile | undefined, files: UploadsFile[]) {
  if (file) {
    try {
      const filename = retrieveFullFilename(file, true);
      await rm(getUploadFilePath(filename));
    } catch (error) {
      console.log("File Deletion Error:", error);
      return errorMessages.internal;
    }

    const sameCategoryFiles = files
      .filter((item) => item.category === file.category)
      .filter((item) => item.id !== file.id)
      .toSorted((a, b) => a.index - b.index)
      .map((item, index) => ({ ...item, index }));

    const finalFiles = files
      .filter((item) => item.category !== file.category)
      .concat(sameCategoryFiles);

    metadataDB.setKey("files", finalFiles);
  }

  return { status: true, message: "Success" };
}
