import type {
  AllowedVisitPaths,
  RateLimitConfig,
  NewUploadsCategorySettings,
  TextRawData,
} from "@/src/@types/database";
import {
  phoneVerification,
  emailVerification,
  facebookSiteVerification,
  instagramSiteVerification,
  whatsappSiteVerification,
  twitterSiteVerification,
} from "../helpers/verifications";

export const projectFolderName = "afra-main";

export function getProjectDir(): string {
  return __filename.split(projectFolderName)[0] + projectFolderName;
}

export const allowedVisitPaths = [
  "about",
  "catalogs",
  "categories",
  "contact",
  "privacy",
  "projects",
  "services",
  "terms",
  "vision",
  "references",
] as const;

export const pathTranslations: AllowedVisitPaths = {
  mainPage: "Ana Sayfa",
  about: "Hakkımızda",
  catalogs: "Kataloglar",
  categories: "Kategoriler",
  contact: "İletişim",
  privacy: "Gizlilik",
  projects: "Projeler",
  services: "Hizmetler",
  terms: "Koşullar",
  vision: "Vizyon",
  references: "Referanslar",
};

export const rateLimitConfig: RateLimitConfig = {
  "update-user": {
    limit: 3,
    interval: 60,
  },
  // firstLogin: {},
  login: {
    limit: 5,
    interval: 60,
  },
  // upload: {},
  verification: {
    limit: 10,
    interval: 60,
  },
  messages: {
    limit: 2,
    interval: 7,
  },
  // verifyUser: {},
  visits: {
    limit: 30,
    interval: 60,
  },
  "get-pdf": {
    limit: 10,
    interval: 15,
  },
};

export const allowedPaths = [
  "dashboard",
  "setup",
  "forgot-password",
  ...allowedVisitPaths,
];

export const uploadsCategoryConfig: NewUploadsCategorySettings = {
  banner: {
    type: "image",
    category: "Banner",
    maxCount: 1,
  },
  favorites: {
    type: "image",
    category: "Favoriler",
    maxCount: 6,
  },
  ads: {
    type: "image",
    category: "Reklamlar",
    maxCount: 3,
  },
  workingAreas: {
    type: "image",
    category: "Çalışma Alanları",
    maxCount: 6,
  },
  catalog: {
    type: "pdf",
    category: "Katalog",
  },
  services: {
    type: "image",
    category: "Hizmetler",
    maxCount: 4,
  },
  "products/": {
    type: "image",
    category: "Kategoriler",
  },
  projects: {
    type: "image",
    category: "Projeler",
  },
  references: {
    type: "image",
    category: "Referanslar",
  },
  logo: {
    type: "image",
    category: "Ana Logo",
    maxCount: 1,
  },
};

export const productCategoryMaxCount = 8;

export const textUploadKeys: TextRawData = {
  name: [256],
  contact: {
    phone: [32, phoneVerification],
    email: [128, emailVerification],
    address: [512],
  },
  social: {
    facebook: [256, facebookSiteVerification],
    instagram: [256, instagramSiteVerification],
    whatsapp: [256, whatsappSiteVerification],
    twitter: [256, twitterSiteVerification],
  },
  about: [4096],
  vision: [4096],
};

export const allowedFileExtensions = {
  image: ["webp", "png", "jpg", "jpeg"],
  pdf: ["pdf"],
} as const;
