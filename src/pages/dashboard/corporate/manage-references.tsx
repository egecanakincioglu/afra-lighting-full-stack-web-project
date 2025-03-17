import ManageReference from "@/src/components/admin/CorporateSettings/ManageReferences";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const ManageReferences: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider fileCategories={["references"]}>
        <ManageReference />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default ManageReferences;
