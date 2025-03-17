import UpdateFavorites from "@/src/components/admin/SiteSettings/UpdateFavorites";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const FavoriteUpdate: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider fileCategories={["favorites"]}>
        <UpdateFavorites />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default FavoriteUpdate;
