import React from "react";
import styles from "../styles/components/LoadingPage.module.scss";

const LoadingPage: React.FC = () => {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingPage;
