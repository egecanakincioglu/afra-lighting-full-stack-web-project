import UpdateCatalog from "@/src/components/admin/products/UpdateCatalog";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const CatalogUpdate: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider fileCategories={["catalog"]}>
        <UpdateCatalog />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default CatalogUpdate;
