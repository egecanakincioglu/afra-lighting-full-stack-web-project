
import ManageGoogleAds from '@/src/components/admin/Integrations/ManageGoogleAds';
import GeneralLayout from '@/src/layouts/GeneralLayout';

import React from 'react';

const AdsGoogle: React.FC = () => {
  return (
    <GeneralLayout>
        <ManageGoogleAds />
    </GeneralLayout>
  );
};

export default AdsGoogle;