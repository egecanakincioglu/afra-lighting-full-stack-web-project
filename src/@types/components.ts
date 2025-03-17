import type { NextRouter } from "next/router";
import type { APIUploadsData, UploadsFile } from "./database";
import type { UploadsProductMetadata } from "../modules/api/schemas";
import type { PDFDocumentProxy } from "pdfjs-dist";

export interface UploadedImage {
  file?: File;
  url?: string;
}

export interface CategoryFileManagerOptions {
  category: string;
  files?: UploadsFile[];
  updateState?: React.Dispatch<React.SetStateAction<UploadsFile[]>>;
}

export type GetDocument = (src: string | Uint8Array) => {
  promise: Promise<PDFDocumentProxy>;
};

export interface Project {
  index: number;
  beforeImage: UploadsFile;
  afterImage: UploadsFile;
  title: string;
  details: string;
}

export interface UseMessageStateOptions<
  DefaultErrorValue = string,
  DefaultSuccessValue = string
> {
  testMode?: boolean;
  defaultErrorValue?: DefaultErrorValue;
  defaultSuccessValue?: DefaultSuccessValue;
  testErrorValue?: NoInfer<DefaultErrorValue>;
  testSuccessValue?: NoInfer<DefaultSuccessValue>;
}

export interface UploadDataProviderProps {
  children: React.ReactNode;
  fileCategories?: string[];
  seo?: boolean;
  texts?: boolean;
}

export type UploadDataTypes = APIUploadsData | undefined;

export interface Social {
  whatsapp?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export interface SocialErrors extends Social {
  others?: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  address?: string;
}

export interface ContactErrors extends Contact {
  others?: string;
}

export interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  data?: string;
}

export interface Service {
  url: string;
  image: File | undefined;
  title: string;
  description: string;
  additionalDescription: string;
}

export interface WorkArea {
  alt?: string;
  image?: File;
  url?: string;
  title?: string;
  description?: string;
}

export interface Message {
  id: number;
  name: string;
  subject: string;
  email: string;
  message: string;
  sent_at?: Date;
}

export interface AdData {
  id: number;
  campaign: string;
  clicks: number;
  impressions: number;
  ctr: string;
}

export type Photo = [URL: string, File?: File];

export interface Photos {
  left: Photo;
  topCenter: Photo;
  bottomCenter: Photo;
  right: Photo;
}

export interface FavoriteProduct {
  image: File | undefined;
  title?: string;
  url?: string;
}

export interface Step2Props {
  dbHost: string;
  dbUsername: string;
  dbPassword: string;
  dbName: string;
  setErrors: (errors: { api: string }) => void;
  router: NextRouter;
}

export interface BeforeAfterSliderProps {
  before: string;
  after: string;
  altText: string;
}

export interface ForgetPasswordProps {
  username?: string;
  email?: string;
  code?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  other?: string;
}

export interface PDFBookProps {
  pdfUrl: string;
}

export interface ProductModalProps {
  product: APIProduct;
  onClose: () => void;
}

export interface UpdateUserPassword {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UpdateUserEmail {
  currentEmail?: string;
  newEmail?: string;
  currentPassword?: string;
}

export interface UpdateUserEmailErrors extends UpdateUserEmail {
  other?: string;
}

export interface UpdateUserPasswordErrors extends UpdateUserPassword {
  other?: string;
}

export type APIProduct = UploadsFile<UploadsProductMetadata>;

export type Product = APIProduct & { metadata: UploadsProductMetadata };

export interface ProductFormData {
  image: {
    data?: File;
    url: string;
  };
  metadata: UploadsProductMetadata;
}
