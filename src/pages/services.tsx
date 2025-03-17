import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ServicesArea from "../components/ServiceArea";
import styles from "../styles/pages/MainPage.module.scss";
import {
  UploadDataProvider,
  useUploadData,
} from "../components/utils/UploadData";
import Seo from "../components/utils/Seo";

const Services: React.FC = () => {
  const { seo } = useUploadData();

  const { page } = seo!;
  const { pages } = page;

  return (
    <UploadDataProvider fileCategories={["services"]} seo texts>
      <Seo
        title={pages.services.title}
        description={pages.services.description}
        keywords={pages.services.keywords}
      />

      <div className={styles.container}>
        <Header />
        <div className={styles.generalSection}>
          <ServicesArea />
        </div>
        <Footer />
      </div>
    </UploadDataProvider>
  );
};

export default Services;
