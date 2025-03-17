import React from "react";
import styles from "@/src/styles/pages/MainPage.module.scss";
import Step3 from "@/src/components/setup/Step3";

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Step3 />
      <div className={styles.generalSection}></div>
    </div>
  );
};

export default HomePage;
