import React from "react";
import styles from "../styles/components/Title.module.scss";

const ReferencesTitle: React.FC = () => {
  return (
    <div className={styles.headingContainer}>
      <span className={styles.backgroundText}>Referanslarımız</span>
      <h1 className={styles.foregroundText}>Referanslarımız</h1>
    </div>
  );
};

export default ReferencesTitle;
