import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import BeforeAfter from "../components/BeforeAfter";
import styles from "../styles/pages/MainPage.module.scss";
import {
  UploadDataProvider,
  useUploadData,
} from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";

const Projects: React.FC = () => {
  const { seo } = useUploadData();

  const { page } = seo!;
  const { pages } = page;

  return (
    <>
      <Seo
        title={pages.projects.title}
        description={pages.projects.description}
        keywords={pages.projects.keywords}
      />

      <div className={styles.container}>
        <Header />
        <div className={styles.generalSection}>
          <UploadDataProvider fileCategories={["projects"]}>
            <BeforeAfter />
          </UploadDataProvider>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Projects;
