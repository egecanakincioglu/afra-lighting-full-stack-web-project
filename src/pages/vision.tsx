import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import VisionArea from "../components/VisionArea";
import VisionTitle from "../components/VisionTitle";
import styles from "../styles/pages/MainPage.module.scss";
import Seo from "../components/utils/Seo";
import { useUploadData } from "../components/utils/UploadData";

const Vision: React.FC = () => {
  const { seo } = useUploadData();
  const { pages } = seo!.page;

  return (
    <>
      <Seo
        title={pages.vision.title}
        description={pages.vision.description}
        keywords={pages.vision.keywords}
      />

      <div className={styles.container}>
        <Header />
        <div className={styles.generalSection}>
          <VisionTitle />
          <VisionArea />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Vision;
