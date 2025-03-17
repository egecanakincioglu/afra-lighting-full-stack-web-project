import React from "react";

import {
  UploadDataProvider,
  useUploadData,
} from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";
import CatalogSystem from "../components/CatalogSystem";

const Catalogs: React.FC = () => {
  const { seo } = useUploadData();

  const { pages } = seo!.page;

  return (
    <>
      <Seo
        title={pages.catalogs.title}
        description={pages.catalogs.description}
        keywords={pages.catalogs.keywords}
      />

      <UploadDataProvider seo fileCategories={["catalog"]}>
        <CatalogSystem />
      </UploadDataProvider>
    </>
  );
};

export default Catalogs;
