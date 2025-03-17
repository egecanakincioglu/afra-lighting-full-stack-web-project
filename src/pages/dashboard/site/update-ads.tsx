import UpdateAdBanners from "@/src/components/admin/SiteSettings/UpdateAds";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const AdsUpdate: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider fileCategories={["ads"]}>
        <UpdateAdBanners />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default AdsUpdate;
