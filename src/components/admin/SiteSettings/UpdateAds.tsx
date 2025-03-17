/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "@/src/styles/admin/SiteSettings/UpdateAds.module.scss";
import type { UploadedImage } from "@/src/@types/components";
import type { UploadsFile } from "@/src/@types/database";
import { createArray } from "@/src/lib/helpers/objects";
import { getUploadAPIFilePath } from "@/src/lib/helpers/api";
import { uploadsCategoryConfig } from "@/src/lib/config/files";
import { useUploadData } from "../../utils/UploadData";
import { useFileManager, useMessageState } from "@/src/lib/helpers/hooks";
import { isString } from "@/src/lib/helpers/verifications";

const emptyItem = { image: undefined, url: "" };

function adsConverter(item: UploadsFile | undefined): UploadedImage {
  return {
    ...emptyItem,
    url: item ? getUploadAPIFilePath(item.id) : "",
  };
}

const UpdateAdBanners: React.FC = () => {
  const { files: { ads: adItems = [] } = {} } = useUploadData();
  const { categoryManager, files } = useFileManager("ads", adItems);

  const count = uploadsCategoryConfig.ads?.maxCount ?? 0;

  const [APIAds, setAPIAds] = useState<UploadedImage[]>(
    createArray(count, (index) => {
      const item = files.find((item) => item.index === index);
      return adsConverter(item);
    })
  );
  const [ads, setAds] = useState<UploadedImage[]>(
    createArray(count, () => emptyItem)
  );
  const [activeDrag, setActiveDrag] = useState<number | undefined>(undefined);

  const {
    setErrorMessage,
    setSuccessMessage,
    clearMessages,
    errorMessage,
    successMessage,
  } = useMessageState();

  const resetAds = async () => {
    try {
      await categoryManager.retrieveFiles();
      const newItems = categoryManager.getFiles().map(adsConverter);

      setAPIAds(newItems);
      setAds(createArray(count, () => emptyItem));
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    setActiveDrag(undefined);
    const file =
      "dataTransfer" in e
        ? e.dataTransfer.files?.[0]
        : (e.target as HTMLInputElement).files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      const updatedBanners = ads.map((item, i) =>
        i === index ? { ...item, image: file, url } : item
      );
      setAds(updatedBanners);
      clearMessages();
    }

    // @ts-expect-error Invalid Type
    e.target.value = null;
  };

  const handleRemoveBanner = (index: number) => {
    const updatedBanners = ads.map((item, i) =>
      i === index ? APIAds.at(index) ?? emptyItem : item
    );
    setAds(updatedBanners);
    clearMessages();
  };

  const handleClearAll = async () => {
    resetAds();
    setSuccessMessage("Tüm reklam panoları temizlendi.");
  };

  const handleUpdate = async () => {
    const completedBanner = ads.some((banner) => banner.file);

    if (!completedBanner) {
      return setErrorMessage(
        "Lütfen en az bir reklam panosuna fotoğraf yükleyin."
      );
    }

    const updatedBanners = ads
      .filter((ad) => ad.file)
      .map((item, index) => {
        const databaseItem = files.find((file) => file.index === index);
        return {
          id: databaseItem?.id,
          file: item.file!,
          index,
        };
      });

    const { error } = await categoryManager.updateFiles(updatedBanners);

    if (isString(error)) return setErrorMessage(error);

    resetAds();
    setSuccessMessage("Reklam panoları başarıyla güncellendi!");
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => {
    e.preventDefault();
    setActiveDrag(position);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveDrag(undefined);
  };

  return (
    <div className={styles.adBannersContainer}>
      <div className={styles.outerBox}>
        <h1>Reklam Panoları</h1>
        <p className={styles.infoText}>
          Yüklemek istediğiniz 3 reklam panosunun fotoğrafını seçin.
        </p>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        <div className={styles.gridContainer}>
          {ads.map((banner, index) => {
            const apiItem = APIAds[index];
            const url = banner.url || apiItem.url;
            const image = banner.file || apiItem.file;

            return (
              <div
                key={index}
                className={`${styles.gridItem} ${
                  activeDrag === index ? styles.drag : ""
                }`}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImageUpload(e, index);
                }}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
              >
                <div className={styles.imageContainer}>
                  {url && (
                    <img
                      src={url}
                      alt={`Banner ${index + 1}`}
                      className={styles.bannerImage}
                    />
                  )}
                  {image && (
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={styles.removeIcon}
                      onClick={() => handleRemoveBanner(index)}
                    />
                  )}

                  {url ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className={styles.hiddenInput}
                    />
                  ) : (
                    <label className={styles.uploadPlaceholder}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        className={styles.hiddenInput}
                      />
                      Fotoğraf Yükle
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.clearButton} onClick={handleClearAll}>
            İçeriği Temizle
          </button>
          <button className={styles.updateButton} onClick={handleUpdate}>
            Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdBanners;
