/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import styles from "../styles/components/Services.module.scss";
import { motion } from "framer-motion";
import type { Service } from "../@types/components";
import { useUploadData } from "./utils/UploadData";
import {
  createArray,
  getKeyConditionally,
  getNormalFile,
} from "../lib/helpers/objects";
import { seoTextReplacer } from "../lib/helpers/seo";
import { uploadsCategoryConfig } from "../lib/config/files";
import { getUploadAPIFilePath } from "../lib/helpers/api";

const MODAL_TRANSITION = { type: "spring", stiffness: 300 };
const MODAL_INITIAL_STATE = { opacity: 0, scale: 0.8 };
const MODAL_ANIMATE_STATE = { opacity: 1, scale: 1 };

const ServicesArea: React.FC = () => {
  const [activeService, setActiveService] = useState<Omit<
    Service,
    "image"
  > | null>(null);
  const { files = {}, seo, texts = {} } = useUploadData();
  const {
    images: { alt: altTemplate },
  } = seo!.component.serviceArea;
  const count = uploadsCategoryConfig.services?.maxCount ?? 0;
  const services = files.services ?? [];

  const ORGANIZATION_NAME = getKeyConditionally(texts, "name", "");
  const SERVICE_DATA: Omit<Service, "image">[] = createArray(count, (index) => {
    const item = getNormalFile(services.find((item) => item.index === index));

    return {
      url: item ? getUploadAPIFilePath(item.id) : "",
      description: item?.metadata?.description ?? "",
      additionalDescription: item?.metadata?.additionalDescription ?? "",
      alt: seoTextReplacer(altTemplate, {
        name: ORGANIZATION_NAME,
      }),
      title: item?.metadata?.title ?? "",
    };
  });

  const openModal = (service: Omit<Service, "image">) => {
    setActiveService(service);
  };

  const closeModal = () => {
    setActiveService(null);
  };

  return (
    <section className={styles.servicesContainer}>
      <div className={styles.grid}>
        {SERVICE_DATA.map((service, index) => (
          <motion.div
            className={styles.card}
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={MODAL_TRANSITION}
          >
            <div className={styles.imageWrapper}>
              <img
                src={service.url}
                alt={service.title}
                className={styles.image}
              />
            </div>
            <div className={styles.textWrapper}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <button
                className={styles.readMoreButton}
                onClick={() => openModal(service)}
              >
                Devamını Oku
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {activeService && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: MODAL_INITIAL_STATE.opacity }}
          animate={{ opacity: MODAL_ANIMATE_STATE.opacity }}
          exit={{ opacity: MODAL_INITIAL_STATE.opacity }}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: MODAL_INITIAL_STATE.scale }}
            animate={{ scale: MODAL_ANIMATE_STATE.scale }}
            exit={{ scale: MODAL_INITIAL_STATE.scale }}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              ✖
            </button>
            <div className={styles.modalImageWrapper}>
              <img
                src={activeService.url}
                alt={activeService.title}
                className={styles.modalImage}
              />
            </div>
            <h3 className={styles.modalTitle}>{activeService.title}</h3>
            <p className={styles.modalDescription}>
              {activeService.additionalDescription}
            </p>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default ServicesArea;
