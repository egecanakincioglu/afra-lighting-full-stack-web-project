import type { JWTPayload } from "jose";
import type {
  PartialRecord,
  RecursiveObject,
  VerificationFunction,
} from "./helpers";
import type { SEOConfig } from "./seo";
import { allowedFileExtensions, allowedVisitPaths } from "../lib/config/files";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  UploadsFileMetadata,
  UploadsFilePatchSchema,
  UploadsFilePostSchema,
  UploadsProductMetadata,
} from "../modules/api/schemas";

export type AllowedVisitPaths = {
  [K in (typeof allowedVisitPaths)[number] | "mainPage"]: string;
};

export type ProductCategoryData = ProductCategory[];

export interface ProductCategory {
  id: string;
  index: number;
  name: string;
}

export type UploadsCategoryMap<Keys extends string = string> = {
  [K in Keys]: UploadsFile[];
};

export interface UploadsData {
  isUploading?: boolean;
  texts: UploadsTextsData;
  files: UploadsFile[];
}

export interface UploadsFileMainData {
  index: number;
  category: string;
}

export interface RetrieveFileExtensionOptions {
  category: string;
}

export interface UploadsFile<
  Metadata = UploadsFileMetadata | UploadsProductMetadata
> extends UploadsFileMainData {
  metadata?: Metadata;
  id: string;
}

export interface FormDataInput {
  file: File;
  index: number;
  category: string;
  metadata?: Record<string, string | number | undefined>;
}

export interface UploadsCategorySetting {
  type: keyof typeof allowedFileExtensions;
  category: string;
  maxCount?: number;
}

export type NewUploadsCategorySettings = PartialRecord<UploadsCategorySetting>;

export type RateLimitConfig = PartialRecord<RateLimitURLConfig>;
export interface RateLimitURLConfig {
  limit: number;
  interval: number;
}

export interface AdSettings {
  clientId: string;
  clientSecret: string;
  developerToken: string;
  managerId: string;
  customerId: string;
  accessToken: string;
  refreshToken: string;
}

export interface SQLData {
  host: string;
  user: string;
  password: string;
  databaseName: string;
  adSettings: Partial<AdSettings>;
}

export interface PendingEmailData {
  email: string;
  token: string;
}

export type UploadsTextsData = PartialRecord<
  RecursiveObject<string | undefined, 1>
>;
export type TextRawSetting = [number, VerificationFunction?];
export type TextRawData = PartialRecord<
  RecursiveObject<TextRawSetting | undefined, 1>
>;

export interface APIUploadsData {
  seo?: SEOConfig;
  texts?: UploadsTextsData;
  files?: Partial<UploadsCategoryMap>;
}

export interface FirstLoginData {
  step1: boolean;
  step2: FirstLoginStep2;
  step3: FirstLoginStep3;
}

export interface FirstLoginStep2 {
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface FirstLoginStep3 {
  email: string;
  password: string;
}

export interface FirstLoginGETData {
  available: boolean;
  currentStep: number;
}

export interface SharedUser {
  id: number;
  username: string;
  email: string;
}

export interface User extends SharedUser {
  passwordHash: string;
  createdAt: Date;
  sessions: string[];
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface MySQLInitalizeOptions {
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface VisitData {
  pageViewed: string;
  country: string;
  city: string;
  visitDate: Date;
  ipAddress: string;
  referrer: string;
  userAgent: string;
}

export interface SuccessfulRequestResult<Data = unknown> {
  status: true;
  message?: string;
  data?: Data;
}

export interface FailedRequestResult {
  status: false;
  message: string;
  code?: number;
}

export type RequestResult<Data = unknown> =
  | FailedRequestResult
  | SuccessfulRequestResult<Data>;

export type VerifyTokenResult =
  | { status: true; data: VerifyTokenResultData }
  | { status: false; data?: VerifyTokenResultData };

export type VerifyUserResult = { status: true; user: User } | { status: false };

export interface VerifyTokenResultData {
  token: string;
  payload: JWTPayload;
}

export type HandlerFunction = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<RequestResult>;

export interface DefaultHandlerOptions {
  post?: HandlerFunction;
  get?: HandlerFunction;
  patch?: HandlerFunction;
  delete?: HandlerFunction;
}
export type HandlerOptions = keyof DefaultHandlerOptions;

export interface UploadsFilePostResult {
  files: UploadsFile[];
  newFiles: UploadsFile[];
}

export interface UploadsFilePatchResult {
  files: UploadsFile[];
  updatedFiles: UploadsFile[];
}

export interface UpdateFilesPostInput
  extends Omit<UploadsFilePostSchema, "category"> {
  category?: string | undefined;
}

export type UpdateFilesInput = (
  | UpdateFilesPostInput
  | Omit<UploadsFilePatchSchema, "id">
) & {
  id?: string | undefined;
  category?: string | undefined;
};

export interface UpdateFilesReturn {
  error: string | undefined;
  newFiles: UploadsFile[] | string;
  updatedFiles: UploadsFile[] | string;
  files: UploadsFile[];
}

export interface APIPatchNewFile {
  oldId?: string;
  newFile: UploadsFile;
}
