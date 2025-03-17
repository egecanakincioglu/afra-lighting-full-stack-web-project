import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AboutArea from "../components/AboutArea";
import AboutTitle from "../components/AboutTitle";
import styles from "../styles/pages/MainPage.module.scss";
import { useUploadData } from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";

const About: React.FC = () => {
  const { seo } = useUploadData();

  const { page } = seo!;
  const { pages } = page;

  return (
    <>
      <Seo
        title={pages.about.title}
        description={pages.about.description}
        keywords={pages.about.keywords}
      />

      <div className={styles.container}>
        <Header />
        <div className={styles.generalSection}>
          <AboutTitle />
          <AboutArea />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;
