import ManageProducts from "@/src/components/admin/products/ManageProducts";
import { UploadDataProvider } from "@/src/components/utils/UploadData";
import GeneralLayout from "@/src/layouts/GeneralLayout";
import { useRouter } from "next/router";

import React from "react";

const ManageProduct: React.FC = () => {
  const router = useRouter();
  const { categoryId } = router.query;

  return (
    <GeneralLayout>
      <UploadDataProvider fileCategories={[`products/${categoryId}`]}>
        <ManageProducts />
      </UploadDataProvider>
    </GeneralLayout>
  );
};

export default ManageProduct;
