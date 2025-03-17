import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CategoryBar from "../components/CategoryBar";
import styles from "../styles/pages/MainPage.module.scss";
import { useUploadData } from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";

const Categories: React.FC = () => {
  const { seo } = useUploadData();
  const { pages } = seo!.page;

  return (
    <>
      <Seo
        title={pages.categories.title}
        description={pages.categories.description}
        keywords={pages.categories.keywords}
      />

      <div className={styles.container}>
        <Header />

        <div className={styles.generalSection}>
          <CategoryBar />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Categories;
