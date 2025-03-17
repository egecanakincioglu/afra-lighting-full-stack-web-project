import { textUploadKeys } from "@/src/lib/config/files";
import type { RequestResult, TextRawSetting } from "@/src/@types/database";
import { createDefaultHandler, errorMessages } from "@/src/modules/api/handler";
import { metadataDB } from "@/src/modules/database/exports";
import { isArray, isObject, isString } from "@/src/lib/helpers/verifications";
import { verifyUser } from "@/src/modules/database/events/verifyUser";

export default createDefaultHandler({
  async get() {
    const data = metadataDB.getKey("texts");
    return { status: true, data };
  },
  async post(req) {
    try {
      const { cookies } = req;
      const { status } = await verifyUser(cookies.sessionToken);

      if (!status) return errorMessages.unauthorized;

      const textUpload = req.body;

      if (!isObject(textUpload)) {
        return { message: "Yüklenen metin bilgileri geçersiz", status: false };
      }

      const partialUploadData = textUpload;
      const systemData = metadataDB.getKey("texts") ?? {};

      const entries = Object.entries(textUpload);

      for (const [key, entry] of entries) {
        if (!isObject(entry) && !isString(entry)) {
          return { message: "Metin bilgileri geçersiz", status: false };
        }

        if (!(key in textUploadKeys)) {
          return { message: `Metin adı ${key} belirtilmemiş`, status: false };
        }

        const setting = textUploadKeys[key as keyof typeof textUploadKeys]!;

        if (isArray(setting)) {
          const result = handleSingleTextUpload(entry, setting);

          if (!result.status) {
            return result;
          }
        } else {
          if (!isObject(entry)) {
            return { message: "Metin bilgisi geçersiz", status: false };
          }

          if (!Object.keys(entry).length) {
            return { message: "Metin bilgileri eksik", status: false };
          }

          if (!(key in partialUploadData))
            // @ts-expect-error undefined key
            partialUploadData[key] = {};

          for (const inlineKey in setting) {
            if (!(inlineKey in entry)) {
              // @ts-expect-error undefined key
              const systemSetting = systemData[key]?.[inlineKey];
              if (systemSetting)
                // @ts-expect-error undefined key,
                partialUploadData[key][inlineKey] = systemSetting;
              continue;
            }

            const inlineSetting: TextRawSetting =
              setting[inlineKey as keyof typeof setting]!;
            const value: unknown = entry[inlineKey as keyof typeof entry];
            const result = handleSingleTextUpload(value, inlineSetting);

            if (!result.status) {
              return result;
            }
          }
        }
      }

      metadataDB.overwriteKey("texts", textUpload);
      return { status: true, message: "Metin başarıyla yüklendi" };
    } catch (error) {
      console.log(error);
      return errorMessages.internal;
    }
  },
});

function handleSingleTextUpload(
  entry: unknown,
  setting: TextRawSetting
): RequestResult {
  const [count, verification] = setting;
  if (!isString(entry)) {
    return { message: "Metin tipi geçersiz", status: false };
  }

  if (!entry.length) {
    return { message: "Metin boş olamaz", status: false };
  }

  if (entry.length > count) {
    return {
      message: `Metin en fazla ${setting} karakter olabilir`,
      status: false,
    };
  }

  if (verification && !verification(entry)) {
    return { message: "Metin doğrulama başarısız", status: false };
  }

  return { status: true };
}
