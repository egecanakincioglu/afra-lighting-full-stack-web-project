import React, { createContext, useState, useEffect, useContext } from "react";
import type { UploadsTextsData } from "../../@types/database";
import LoadingPage from "../LoadingPage";
import {
  getUploadsCategories,
  getUploadsSEO,
  getUploadsTexts,
} from "@/src/lib/helpers/api";
import { type UploadsCategoryMap } from "@/src/@types/database";
import type { SEOConfig } from "@/src/@types/seo";
import type {
  UploadDataProviderProps,
  UploadDataTypes,
} from "@/src/@types/components";

const UploadDataContext = createContext<UploadDataTypes>(undefined);

export function UploadDataProvider({
  children,
  fileCategories,
  seo: useSeo,
  texts: useTexts,
}: UploadDataProviderProps) {
  const [uploadData, setUploadData] = useState<UploadDataTypes>();

  useEffect(() => {
    const fetchUploadData = async () => {
      try {
        if (fileCategories || useSeo || useTexts) {
          let files: UploadsCategoryMap<string> | undefined = undefined;
          let seo: SEOConfig | undefined = undefined;
          let texts: UploadsTextsData | undefined = undefined;

          if (fileCategories?.length) {
            files = await getUploadsCategories(...fileCategories.toSorted());
          }

          if (useSeo) {
            seo = await getUploadsSEO();
          }

          if (useTexts) {
            texts = await getUploadsTexts();
          }

          setUploadData({ files, seo, texts });
          return;
        }
      } catch (error) {
        console.error("Failed to fetch upload data:", error);
      }
    };

    fetchUploadData();
  }, []);

  if (!uploadData) return <LoadingPage />;

  return (
    <UploadDataContext.Provider value={uploadData}>
      {children}
    </UploadDataContext.Provider>
  );
}

export const useUploadData = () => {
  const context = useContext(UploadDataContext);
  if (context === undefined) {
    throw new Error("useUploadData must be used within a UploadDataProvider");
  }
  return context;
};
