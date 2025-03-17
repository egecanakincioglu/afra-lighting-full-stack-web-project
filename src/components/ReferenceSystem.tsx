import React, { useState } from "react";
import styles from "../styles/components/ReferenceSystem.module.scss";
import { useUploadData } from "./utils/UploadData";
import type { UploadsFile } from "../@types/database";
import type { UploadsFileMetadata } from "../modules/api/schemas";
import { getUploadAPIFilePath } from "../lib/helpers/api";

const ReferenceSystem: React.FC = () => {
  const { files: { references: r = [] } = {} } = useUploadData();
  const references = r as UploadsFile<UploadsFileMetadata>[];

  const [selectedReference, setSelectedReference] =
    useState<UploadsFile<UploadsFileMetadata>>();
  const [currentPage, setCurrentPage] = useState(1);
  const referencesPerPage = 16;

  const indexOfLastReference = currentPage * referencesPerPage;
  const indexOfFirstReference = indexOfLastReference - referencesPerPage;
  const currentReferences = references.slice(
    indexOfFirstReference,
    indexOfLastReference
  );
  const totalPages = Math.ceil(references.length / referencesPerPage);

  const openModal = (reference: UploadsFile<UploadsFileMetadata>) => {
    setSelectedReference(reference);
  };

  const closeModal = () => setSelectedReference(undefined);

  return (
    <div className={styles.referenceSystem}>
      <div className={styles.referenceGrid}>
        {currentReferences.map((reference) => (
          <div
            key={reference.id}
            className={styles.referenceItem}
            onClick={() => openModal(reference)}
          >
            <div className={styles.imageContainer}>
              <img
                src={getUploadAPIFilePath(reference.id)}
                alt={reference.metadata?.title}
                className={styles.referenceLogo}
              />
            </div>
            <div className={styles.referenceContent}>
              <h3 className={styles.referenceName}>
                {reference.metadata?.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {selectedReference && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
            <img
              src={getUploadAPIFilePath(selectedReference.id)}
              alt={selectedReference.metadata?.title}
              className={styles.modalLogo}
            />
            <h2 className={styles.modalTitle}>
              {selectedReference.metadata?.title}
            </h2>
            <p className={styles.modalDescription}>
              {selectedReference.metadata?.description}
            </p>
            <a
              href={selectedReference.metadata?.additionalDescription}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.visitButton}
            >
              Ziyaret Et
            </a>
          </div>
        </div>
      )}

      <div className={styles.pagination}>
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>
            Önceki
          </button>
        )}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? styles.activePage : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>
            Sonraki
          </button>
        )}
      </div>
    </div>
  );
};

export default ReferenceSystem;
