import { productCategoryMaxCount } from "@/src/lib/config/files";
import { isNumber } from "@/src/lib/helpers/verifications";
import { z } from "zod";

export const idSchema = z.object({
  id: z.string(),
});

export const indexSchema = (maxCount?: number) => {
  const baseSchema = z.number().min(0).int();
  return isNumber(maxCount) ? baseSchema.max(maxCount) : baseSchema;
};

export const baseUploadsMetadata = z
  .object({
    title: z.string(),
    description: z.string(),
    additionalDescription: z.string(),
  })
  .partial();

export type UploadsFileMetadata = z.infer<typeof baseUploadsMetadata>;

export const productsUploadsMetadata = z
  .object({
    name: z.string(),
    code: z.string(),
    color: z.string(),
    material: z.string(),
    power: z.string(),
    dimensions: z.string(),
    price: z.string(),
  })
  .partial()
  .required({ name: true });

export type UploadsProductMetadata = z.infer<typeof productsUploadsMetadata>;

export const uploadsBasePostSchema = z.object({
  file: z.instanceof(File),
  index: indexSchema(),
  category: z.string(),
});

export const uploadsFilePostSchema = uploadsBasePostSchema
  .extend({ metadata: baseUploadsMetadata.optional() })
  .or(uploadsBasePostSchema.extend({ metadata: productsUploadsMetadata }));

export type UploadsFilePostSchema = z.infer<typeof uploadsFilePostSchema>;

export const uploadsFilePatchSchema = idSchema.extend({
  index: indexSchema().optional(),
  file: z.instanceof(File).optional(),
  metadata: z
    .union([baseUploadsMetadata, productsUploadsMetadata.partial()])
    .optional(),
});

export type UploadsFilePatchSchema = z.infer<typeof uploadsFilePatchSchema>;

export const uploadsFileBasePostSchema = uploadsBasePostSchema
  .extend({ metadata: baseUploadsMetadata })
  .partial({ metadata: true });

export type UploadsFileBasePostSchema = z.infer<
  typeof uploadsFileBasePostSchema
>;

export const uploadsFileProductPostSchema = uploadsBasePostSchema.extend({
  metadata: productsUploadsMetadata,
});

export type UploadsFileProductPostSchema = z.infer<
  typeof uploadsFileProductPostSchema
>;

export const uploadsFileBasePatchSchema = z.object({
  id: z.string(),
  data: baseUploadsMetadata.partial(),
});

export type UploadsFileBasePatchSchema = z.infer<
  typeof uploadsFileBasePatchSchema
>;

export const uploadsFileProductPatchSchema = uploadsFileBasePatchSchema.extend({
  data: productsUploadsMetadata.partial(),
});

export type UploadsFileProductPatchSchema = z.infer<
  typeof uploadsFileProductPatchSchema
>;

export const uploadsCategoriesPostSchema = z.object({
  name: z.string(),
  index: indexSchema(productCategoryMaxCount),
});

export type UploadsCategoriesPostSchema = z.infer<
  typeof uploadsCategoriesPostSchema
>;

export const uploadsCategoriesPatchSchema = idSchema.extend({
  data: z.object({ name: z.string() }),
});

export type UploadsCategoriesPatchSchema = z.infer<
  typeof uploadsCategoriesPatchSchema
>;

export type UploadsCategoriesDeleteSchema = z.infer<typeof idSchema>;
