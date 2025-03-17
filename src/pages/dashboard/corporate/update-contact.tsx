import GeneralLayout from "@/src/layouts/GeneralLayout";
import React from "react";
import UpdateContact from "@/src/components/admin/CorporateSettings/UpdateContact";
import { UploadDataProvider } from "@/src/components/utils/UploadData";

const EditContact: React.FC = () => {
  return (
    <GeneralLayout>
      <UploadDataProvider texts>
        <UpdateContact />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default EditContact;
