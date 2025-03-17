import GeneralLayout from '@/src/layouts/GeneralLayout';
import UpdateLogo from '@/src/components/admin/CorporateSettings/UpdateLogo';
import React from 'react';

const EditLogo: React.FC = () => {
  return (
    <GeneralLayout>
      <UpdateLogo />
    </GeneralLayout>
  );
};

export default EditLogo;