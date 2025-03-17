import ManageProjects from "@/src/components/admin/Projects/ManageProjects";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const CatalogUpdate: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider fileCategories={["projects"]}>
        <ManageProjects />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default CatalogUpdate;
