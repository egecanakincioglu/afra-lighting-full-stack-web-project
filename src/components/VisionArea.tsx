import React from "react";
import styles from "../styles/components/Vision.module.scss";
import { useUploadData } from "./utils/UploadData";
import { getKeyConditionally } from "../lib/helpers/objects";

const VisionArea: React.FC = () => {
  const { texts = {} } = useUploadData();
  const VISION_TEXT = getKeyConditionally(texts, "vision", "");

  return (
    <section className={styles.visionContainer}>
      <div className={styles.visionContent}>
        <p className={styles.visionText}>{VISION_TEXT}</p>
      </div>
    </section>
  );
};

export default VisionArea;
