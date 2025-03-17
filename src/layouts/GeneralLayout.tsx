import AdminFooter from "../components/admin/Footer";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import React from "react";
import styles from "@/src/styles/layouts/GeneralLayout.module.scss";
import { useUploadData } from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";

const GeneralLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { seo } = useUploadData();
  const { title, description, keywords } = seo!.page.pages.dashboard;

  return (
    <div>
      <Seo title={title} description={description} keywords={keywords} />

      <AdminNavbar />
      <div className={styles.content}>{children}</div>
      <AdminFooter />
    </div>
  );
};

export default GeneralLayout;
