import UpdateWorkAreas from "@/src/components/admin/SiteSettings/UpdateWorkingAreas";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const WorkingAreasUpdate: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider fileCategories={["workingAreas"]}>
        <UpdateWorkAreas />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default WorkingAreasUpdate;
