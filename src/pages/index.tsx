import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Highlights from "../components/Highlights";
import HighlightTitle from "../components/HighlightTitle";
import React from "react";
import styles from "../styles/pages/MainPage.module.scss";
import WorkingAreas from "../components/WorkingAreas";
import WorkingAreaTitle from "../components/WorkingAreasTitle";
import {
  UploadDataProvider,
  useUploadData,
} from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";

const HomePage: React.FC = () => {
  const { seo } = useUploadData();
  const { page } = seo!;
  const { name, description, keywords } = page;

  return (
    <>
      <Seo title={name} description={description} keywords={keywords} />

      <UploadDataProvider
        fileCategories={[
          "banner",
          "favorites",
          "workingAreas",
          "ads",
          "catalog",
        ]}
        seo
        texts
      >
        <div className={styles.container}>
          <Header />
          <div className={styles.generalSection}>
            <main>
              <div className={styles.generalSection}>
                <Banner />
              </div>
              <div className={styles.generalSection}>
                <HighlightTitle />
              </div>
              <div className={styles.generalSection}>
                <Highlights />
              </div>
              <div className={styles.generalSection}>
                <WorkingAreaTitle />
              </div>
              <div className={styles.generalSection}>
                <WorkingAreas />
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </UploadDataProvider>
    </>
  );
};

export default HomePage;
