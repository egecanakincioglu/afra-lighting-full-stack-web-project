import React from "react";
import styles from "../styles/components/LoadingPage.module.scss";

const LoadingElement: React.FC = () => {
  return (
    <div className={styles.loadingElement}>
      <div className={styles.elementSpinner}></div>
    </div>
  );
};

export default LoadingElement;
