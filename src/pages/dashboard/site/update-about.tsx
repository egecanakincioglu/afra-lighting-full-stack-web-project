import UpdateAbout from "@/src/components/admin/SiteSettings/UpdateAbout";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const AboutUpdate: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider texts>
        <UpdateAbout />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default AboutUpdate;
