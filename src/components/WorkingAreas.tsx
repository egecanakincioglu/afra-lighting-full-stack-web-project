/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../styles/components/WorkingAreas.module.scss";
import { motion } from "framer-motion";
import type { WorkArea } from "../@types/components";
import { useUploadData } from "./utils/UploadData";
import { createArray, getNormalFile } from "../lib/helpers/objects";
import { seoTextReplacer } from "../lib/helpers/seo";
import { uploadsCategoryConfig } from "../lib/config/files";
import { getUploadAPIFilePath } from "../lib/helpers/api";

const WorkingAreas: React.FC = () => {
  const { seo, files = {} } = useUploadData();
  const { images } = seo!.component.workingAreas;
  const count = uploadsCategoryConfig.workingAreas?.maxCount ?? 0;
  const { workingAreas } = files;

  const WORK_AREAS: WorkArea[] = createArray(count, (index) => {
    const item = getNormalFile(
      workingAreas?.find((item) => item.index === index)
    );

    const url = item ? getUploadAPIFilePath(item.id) : "";
    const title = item?.metadata?.title ?? "";
    const description = item?.metadata?.description ?? "";
    const alt = seoTextReplacer(images.alt, { alt: title });

    return { image: undefined, url, title, description, alt };
  });

  return (
    <section className={styles.workAreas}>
      <div className={styles.container}>
        {WORK_AREAS.map((area, index) => (
          <motion.div
            className={styles.card}
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles.imageWrapper}>
              <img src={area.url} alt={area.alt} className={styles.image} />
            </div>
            <div className={styles.textWrapper}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WorkingAreas;
