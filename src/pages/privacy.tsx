import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PrivacyPolicy from "../components/PrivacyArea";
import PrivacyTitle from "../components/PrivacyTitle";
import styles from "../styles/pages/MainPage.module.scss";
import { useUploadData } from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";

const Privacy: React.FC = () => {
  const { seo } = useUploadData();

  const { page } = seo!;
  const { pages } = page;

  return (
    <>
      <Seo
        title={pages.privacy.title}
        description={pages.privacy.description}
        keywords={pages.privacy.keywords}
      />

      <div className={styles.container}>
        <Header />
        <div className={styles.generalSection}>
          <PrivacyTitle />
          <PrivacyPolicy />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Privacy;
