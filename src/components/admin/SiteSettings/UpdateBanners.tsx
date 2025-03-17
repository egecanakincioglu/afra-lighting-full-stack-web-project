import React, { useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/src/styles/admin/SiteSettings/UpdateBanners.module.scss";
import type { Photo } from "@/src/@types/components";
import { getUploadAPIFilePath } from "@/src/lib/helpers/api";
import { useUploadData } from "../../utils/UploadData";
import { useFileManager, useMessageState } from "@/src/lib/helpers/hooks";
import { isString } from "@/src/lib/helpers/verifications";

const UpdateBanners: React.FC = () => {
  const { files: { banner: banners = [] } = {} } = useUploadData();
  const { categoryManager, files } = useFileManager("banner", banners);

  const [firstBanner] = files;

  const [APIBanner, setAPIBanner] = useState<Photo>([
    firstBanner?.id ? getUploadAPIFilePath(firstBanner.id) : "",
  ]);
  const [banner, setBanner] = useState<Photo>();
  const [activeDrag, setActiveDrag] = useState<boolean>(false);
  const [isUploading, setUploading] = useState<boolean>(false);

  const {
    setErrorMessage,
    setSuccessMessage,
    clearMessages,
    errorMessage,
    successMessage,
  } = useMessageState();

  const resetBanners = async () => {
    try {
      const banner = categoryManager.getFiles().at(0)!;
      const bannerURL = banner?.id ? getUploadAPIFilePath(banner.id) : "";
      const newItem = [bannerURL] satisfies Photo;

      setAPIBanner(newItem);
      setBanner(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setUploading(true);
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setBanner([url, file] satisfies Photo);
      clearMessages();
    } else {
      setErrorMessage("Dosya algılanmadı.");
    }

    // @ts-expect-error Invalid Type
    e.target.value = null;
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setUploading(true);
    setActiveDrag(false);
    const file = e.dataTransfer.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setBanner([url, file] satisfies Photo);
      clearMessages();
    } else {
      setErrorMessage("Dosya algılanmadı.");
    }

    setUploading(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveDrag(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveDrag(false);
  };

  const handleRemovePhoto = () => {
    resetBanners();
    clearMessages();
  };

  const handleClearPhotos = () => {
    resetBanners();
    setSuccessMessage("Fotoğraf temizlendi.");
  };

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setUploading(true);
    clearMessages();

    const file = banner?.[1];

    if (!file) {
      setErrorMessage("En az bir fotoğraf yükleyin.");
      setUploading(false);
      return;
    }

    const { newFiles, updatedFiles } = await categoryManager.updateFiles([
      { id: firstBanner?.id, file, index: 0 },
    ]);

    const error = [newFiles, updatedFiles].find(isString);

    if (error !== undefined) {
      setErrorMessage(error);
    } else {
      setSuccessMessage("Fotoğraf başarıyla güncellendi!");
      resetBanners();
    }

    setUploading(false);
  };

  const [url, file] = banner ?? APIBanner;

  return (
    <div className={styles.updateBannersContainer}>
      <div className={styles.innerBox}>
        <h1>Banner Güncelleme</h1>
        <p className={styles.infoText}>
          Banner sistemine eklemek istediğiniz fotoğrafı kutuya sürükleyin ya da
          yükleyin.
        </p>
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successText}>{successMessage}</p>
        )}
        <div className={styles.photoGridContainer}>
          <div
            className={`${styles.gridItem} ${styles.topCenter} ${
              activeDrag ? styles.drag : ""
            }`}
            style={{
              backgroundImage: url ? `url(${url})` : undefined,
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {file && (
              <FontAwesomeIcon
                icon={faTimes}
                className={styles.removeIcon}
                onClick={handleRemovePhoto}
              />
            )}
            {!url && (
              <div className={styles.uploadPlaceholder}>Fotoğraf yükle</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className={styles.hiddenInput}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            disabled={isUploading}
            className={styles.clearButton}
            onClick={handleClearPhotos}
            type="button"
          >
            Fotoğrafı Temizle
          </button>
          <button
            disabled={isUploading}
            className={styles.updateButton}
            onClick={handleUpdate}
            type="button"
          >
            Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBanners;
