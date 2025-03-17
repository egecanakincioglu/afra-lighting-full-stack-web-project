import React from "react";
import styles from "@/src/styles/pages/MainPage.module.scss";
import Step2 from "@/src/components/setup/Step2";

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Step2 />
      <div className={styles.generalSection}></div>
    </div>
  );
};

export default HomePage;
