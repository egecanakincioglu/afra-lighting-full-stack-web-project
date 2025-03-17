import React from "react";
import styles from "../styles/components/Title.module.scss";
import { useUploadData } from "./utils/UploadData";

const PrivacyTitle: React.FC = () => {
  const { seo } = useUploadData();
  const {
    title: { backgroundText, foregroundText },
  } = seo!.component.privacy;

  return (
    <div className={styles.headingContainer}>
      <span className={styles.backgroundText}>{backgroundText}</span>
      <h1 className={styles.foregroundText}>{foregroundText}</h1>
    </div>
  );
};

export default PrivacyTitle;
