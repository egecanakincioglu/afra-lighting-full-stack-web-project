import UpdateBanners from "@/src/components/admin/SiteSettings/UpdateBanners";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const BannerUpdate: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider fileCategories={["banner"]}>
        <UpdateBanners />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default BannerUpdate;
