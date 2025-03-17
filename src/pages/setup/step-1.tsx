import React from "react";
import styles from "@/src/styles/pages/MainPage.module.scss";
import Step1 from "@/src/components/setup/Step1";

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Step1 />
      <div className={styles.generalSection}></div>
    </div>
  );
};

export default HomePage;
