import React from "react";
import styles from "@/src/styles/pages/MainPage.module.scss";
import Step4 from "@/src/components/setup/Step4";

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Step4 />
      <div className={styles.generalSection}></div>
    </div>
  );
};

export default HomePage;
