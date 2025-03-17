import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TermsOfService from "../components/Terms";
import TermsTitle from "../components/TermsTitle";
import styles from "../styles/pages/MainPage.module.scss";
import { useUploadData } from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";

const Terms: React.FC = () => {
  const { seo } = useUploadData();

  const { pages } = seo!.page;

  return (
    <>
      <Seo
        title={pages.terms.title}
        description={pages.terms.description}
        keywords={pages.terms.keywords}
      />

      <div className={styles.container}>
        <Header />
        <div className={styles.generalSection}>
          <TermsTitle />
          <TermsOfService />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Terms;
