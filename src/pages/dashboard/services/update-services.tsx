import UpdateServices from "@/src/components/admin/Services/UpdateServices";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const BannerUpdate: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider fileCategories={["services"]}>
        <UpdateServices />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default BannerUpdate;
