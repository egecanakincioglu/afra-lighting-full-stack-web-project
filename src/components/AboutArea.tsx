import React from "react";
import styles from "../styles/components/About.module.scss";
import { getKeyConditionally } from "../lib/helpers/objects";
import { useUploadData } from "./utils/UploadData";

const AboutArea: React.FC = () => {
  const { texts = {} } = useUploadData();
  const ABOUT_TEXT = getKeyConditionally(texts, "about", "");

  return (
    <section className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <p className={styles.aboutText}>
          {ABOUT_TEXT.split("\n").map((item) => (
            <>
              {item}
              <br />
            </>
          ))}
        </p>
      </div>
    </section>
  );
};

export default AboutArea;
