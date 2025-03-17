import UpdateName from "@/src/components/admin/CorporateSettings/UpdateName";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const EditName: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider texts>
        <UpdateName />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default EditName;
