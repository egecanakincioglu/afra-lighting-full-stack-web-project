import UpdatePassword from "@/src/components/admin/AdminSettings/UpdatePassword";
import GeneralLayout from "@/src/layouts/GeneralLayout";

import React from "react";

const UserUpdate: React.FC = () => {
  return (
    <GeneralLayout>
      <UpdatePassword />
    </GeneralLayout>
  );
};

export default UserUpdate;
