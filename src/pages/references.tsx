import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "../styles/pages/MainPage.module.scss";
import {
  UploadDataProvider,
  useUploadData,
} from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";
import ReferenceSystem from "../components/ReferenceSystem";
import ReferencesTitle from "../components/ReferenceTitle";

const References: React.FC = () => {
  const { seo } = useUploadData();
  const { pages } = seo!.page;

  return (
    <>
      <Seo
        title={pages.references.title}
        description={pages.references.description}
        keywords={pages.references.keywords}
      />

      <div className={styles.container}>
        <Header />

        <div className={styles.generalSection}>
          <ReferencesTitle />
          <UploadDataProvider fileCategories={["references"]}>
            <ReferenceSystem />
          </UploadDataProvider>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default References;
