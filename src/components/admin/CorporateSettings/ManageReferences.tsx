import React, { useState } from "react";
import styles from "../../../styles/admin/CorporateSettings/ManageReferences.module.scss";
import type { UploadedImage } from "@/src/@types/components";
import { useUploadData } from "../../utils/UploadData";
import { useFileManager } from "@/src/lib/helpers/hooks";
import { getNormalFile, removeNullishValues } from "@/src/lib/helpers/objects";
import { getUploadAPIFilePath } from "@/src/lib/helpers/api";
import type { UploadsFile } from "@/src/@types/database";
import type { UploadsFileMetadata } from "@/src/modules/api/schemas";
import { isString } from "@/src/lib/helpers/verifications";

const ManageReferences: React.FC = () => {
  const { files: { references: referencesData = [] } = {} } = useUploadData();
  const { categoryManager, files } = useFileManager(
    "references",
    referencesData
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedReference, setSelectedReference] = useState<UploadsFile>();
  const [isDragging, setIsDragging] = useState(false);

  const [logo, setLogo] = useState<UploadedImage>();
  const [name, setName] = useState<string>();
  const [details, setDetails] = useState<string>();
  const [website, setWebsite] = useState<string>();

  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [referenceToDelete, setReferenceToDelete] = useState<string>();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleLogoUpload(files[0]);
    }
  };

  const openModal = (
    type: "add" | "edit",
    reference?: UploadsFile<UploadsFileMetadata>
  ) => {
    setModalType(type);
    setIsModalOpen(true);
    if (type === "edit" && reference) {
      setSelectedReference(reference);
      setLogo({ url: getUploadAPIFilePath(reference.id) });
      setName(reference.metadata?.title);
      setDetails(reference.metadata?.description);
      setWebsite(reference.metadata?.additionalDescription);
    } else {
      setLogo(undefined);
      setName(undefined);
      setDetails(undefined);
      setWebsite(undefined);
    }
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReference(undefined);
    setLogo(undefined);
    setName(undefined);
    setDetails(undefined);
    setError("");
    setWebsite(undefined);
  };

  const handleLogoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setLogo({ file, url });
  };

  const handleAddReference = async () => {
    if (!logo?.file || !name || !details || !website)
      return setError("Lütfen tüm alanları doldurun!");

    const newFile = {
      file: logo.file,
      index: files.length,
      metadata: {
        title: name,
        description: details,
        additionalDescription: website,
      },
    };

    const result = await categoryManager.post([newFile]);

    if (isString(result)) return setError(result);

    closeModal();
  };

  const handleEditReference = async () => {
    if (!selectedReference) return;

    if (!logo?.file && !name && !details && !website) {
      return setError("Lütfen tüm alanları doldurun!");
    }

    const updatedAreas = removeNullishValues(
      {
        id: selectedReference.id,
        file: logo?.file,
        metadata: {
          title: name,
          description: details,
          additionalDescription: website,
        },
      },
      [""]
    );

    const result = await categoryManager.patch([updatedAreas]);

    if (isString(result)) return setError(result);

    closeModal();
  };

  const handleDeleteReference = async (id: string) => {
    const result = await categoryManager.delete(id);

    if (isString(result)) return setError(result);

    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (id: string) => {
    setReferenceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setReferenceToDelete(undefined);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          + Referans Ekle
        </button>
      </div>

      {files.length === 0 ? (
        <div className={styles.noReferenceMessage}>
          <p>Burada hiç referans yok 😔</p>
        </div>
      ) : (
        <ul className={styles.referenceList}>
          {files.map((r) => {
            const reference = getNormalFile(r, true);

            return (
              <li key={reference.id} className={styles.referenceItem}>
                <div className={styles.referenceInfo}>
                  {reference && (
                    <img
                      src={getUploadAPIFilePath(reference.id)}
                      alt={reference.metadata?.title}
                      className={styles.referenceLogo}
                    />
                  )}
                  <span className={styles.referenceName}>
                    {reference.metadata?.title}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.editButton}
                    onClick={() => openModal("edit", reference)}
                  >
                    Düzenle
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => openDeleteModal(reference.id)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>
              {modalType === "add" ? "Referans Ekle" : "Referansı Düzenle"}
            </h3>
            <div
              className={`${styles.logoUpload} ${
                isDragging ? styles.dragging : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label htmlFor="logoInput" className={styles.logoLabel}>
                {logo?.url ? (
                  <img
                    src={logo.url}
                    alt="Logo"
                    className={styles.logoPreview}
                  />
                ) : (
                  <div className={styles.logoPlaceholder}>
                    {isDragging
                      ? "Fotoğrafı buraya bırakın"
                      : "Sürükleyip bırakın veya tıklayın"}
                  </div>
                )}
              </label>
              <input
                id="logoInput"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleLogoUpload(e.target.files[0])
                }
                className={styles.logoInput}
              />
            </div>
            <input
              type="text"
              placeholder="Şirket adı girin..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <textarea
              placeholder="Şirket detaylarını girin..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className={styles.textarea}
            />
            <input
              type="text"
              placeholder="Şirketin web sitesini girin..."
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={styles.input}
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeModal}>
                İptal
              </button>
              <button
                className={styles.confirmButton}
                onClick={
                  modalType === "add" ? handleAddReference : handleEditReference
                }
              >
                {modalType === "add" ? "Ekle" : "Güncelle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>UYARI!</h3>
            <p className={styles.warningText}>
              Bu referansı silmek istediğinizden emin misiniz?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={closeDeleteModal}
              >
                İptal
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={() =>
                  referenceToDelete && handleDeleteReference(referenceToDelete)
                }
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReferences;
