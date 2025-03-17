/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "@/src/styles/admin/SiteSettings/UpdateWorkingAreas.module.scss";
import type { WorkArea } from "@/src/@types/components";
import type { UploadsFile } from "@/src/@types/database";
import { getUploadAPIFilePath } from "@/src/lib/helpers/api";
import {
  createArray,
  getNormalFile,
  removeNullishValues,
} from "@/src/lib/helpers/objects";
import { uploadsCategoryConfig } from "@/src/lib/config/files";
import { useUploadData } from "../../utils/UploadData";
import { useFileManager, useMessageState } from "@/src/lib/helpers/hooks";
import { isString } from "@/src/lib/helpers/verifications";

const emptyItem = {
  image: undefined,
  title: undefined,
  description: undefined,
  url: undefined,
  alt: undefined,
};

function areaConverter(inputItem: UploadsFile | undefined): WorkArea {
  const item = getNormalFile(inputItem);

  return {
    ...emptyItem,
    title: item?.metadata?.title,
    description: item?.metadata?.description,
    url: item && getUploadAPIFilePath(item.id),
  };
}

const UpdateWorkAreas: React.FC = () => {
  const { files: { workingAreas } = {} } = useUploadData();
  const { categoryManager, files } = useFileManager(
    "workingAreas",
    workingAreas
  );

  const count = uploadsCategoryConfig.workingAreas?.maxCount ?? 0;

  const [APIAreas, setAPIAreas] = useState<WorkArea[]>(
    createArray(count, (index) => {
      const item = files.find((item) => item.index === index);
      return areaConverter(item);
    })
  );
  const [areas, setAreas] = useState<WorkArea[]>(
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

  const resetWorkAreas = async () => {
    try {
      await categoryManager.retrieveFiles();
      const newItems = categoryManager.getFiles().map(areaConverter);

      setAPIAreas(newItems);
      setAreas(createArray(count, () => emptyItem));
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
      const updatedAreas = [...areas];
      updatedAreas[index] = { ...updatedAreas[index], url, image: file };
      setAreas(updatedAreas);
      clearMessages();
    }

    // @ts-expect-error Invalid Type
    e.target.value = null;
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedAreas = [...areas];
    updatedAreas[index] = { ...updatedAreas[index], title: e.target.value };
    setAreas(updatedAreas);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedAreas = [...areas];
    updatedAreas[index] = {
      ...updatedAreas[index],
      description: e.target.value,
    };
    setAreas(updatedAreas);
  };

  const handleRemoveArea = (index: number) => {
    const updatedProducts = areas.map((item, i) =>
      i === index ? APIAreas.at(index) ?? emptyItem : item
    );
    setAreas(updatedProducts);
    clearMessages();
  };

  const handleClearAll = () => {
    resetWorkAreas();
    setSuccessMessage("Tüm çalışma alanları temizlendi.");
  };

  const handleUpdate = async () => {
    const completedArea = areas.some((product, index) => {
      const apiItem = APIAreas[index];
      return apiItem
        ? product.image || product.title || product.alt || product.description
        : product.image && product.title && product.alt && product.description;
    });

    if (!completedArea) {
      return setErrorMessage(
        "Lütfen en az bir alanın fotoğrafını, başlığını ve açıklamasını doldurun veya mevcut ürünlerden birini düzenleyin."
      );
    }

    const updatedAreas = areas
      .map(({ image, title, description }, index) => ({
        id: files.find((item) => item.index === index)?.id,
        file: image,
        index,
        metadata: removeNullishValues({ title, description }),
      }))
      .filter(
        ({ file, metadata }) => file || metadata.description || metadata.title
      );

    const { error } = await categoryManager.updateFiles(updatedAreas);

    if (isString(error)) return setErrorMessage(error);

    resetWorkAreas();
    setSuccessMessage("Çalışma alanları başarıyla güncellendi!");
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
    <div className={styles.workAreasContainer}>
      <div className={styles.outerBox}>
        <h1>Çalışma Alanları</h1>
        <p className={styles.infoText}>
          {count} adet çalışma alanı için fotoğraf, başlık ve açıklama girin.
        </p>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        <div className={styles.gridContainer}>
          {areas.map((area, index) => {
            const apiItem = APIAreas[index];
            const url = area.url || apiItem.url;
            const image = area.image || apiItem.image;
            const title = area.title || apiItem.title;
            const description = area.description || apiItem.description;

            return (
              <div
                key={index}
                className={`${styles.gridItem} ${
                  index === activeDrag ? styles.drag : ""
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
                      alt={`Work Area ${index + 1}`}
                      className={styles.areaImage}
                    />
                  )}
                  {image && (
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={styles.removeIcon}
                      onClick={() => handleRemoveArea(index)}
                    />
                  )}
                  {url ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      placeholder="Fotoğraf Yükle"
                    />
                  ) : (
                    <label className={styles.uploadPlaceholder}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                      Fotoğraf Yükle
                    </label>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Başlık Girin"
                  value={title}
                  onChange={(e) => handleTitleChange(e, index)}
                  className={styles.titleInput}
                />
                <textarea
                  placeholder="Açıklama Girin"
                  value={description}
                  onChange={(e) => handleDescriptionChange(e, index)}
                  className={styles.descriptionInput}
                />
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

export default UpdateWorkAreas;
