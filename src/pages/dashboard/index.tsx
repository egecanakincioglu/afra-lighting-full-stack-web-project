import Login from "@/src/components/admin/LoginMenu";
import React from "react";
import styles from "@/src/styles/pages/MainPage.module.scss";
import { useUploadData } from "@/src/components/utils/UploadData";
import Seo from "@/src/components/utils/Seo";

const HomePage: React.FC = () => {
  const { seo } = useUploadData();
  const { title, description, keywords } = seo!.page.pages.dashboard;

  return (
    <div className={styles.container}>
      <Seo title={title} description={description} keywords={keywords} />
      <Login />
      <div className={styles.generalSection}></div>
    </div>
  );
};

export default HomePage;
