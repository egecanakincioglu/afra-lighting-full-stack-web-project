/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "@/src/styles/admin/Services/UpdateServices.module.scss";
import type { Service } from "@/src/@types/components";
import type { UploadsFile } from "@/src/@types/database";
import { getUploadAPIFilePath } from "@/src/lib/helpers/api";
import {
  createArray,
  getNormalFile,
  removeNullishValues,
} from "@/src/lib/helpers/objects";
import { useUploadData } from "../../utils/UploadData";
import { uploadsCategoryConfig } from "@/src/lib/config/files";
import { useFileManager, useMessageState } from "@/src/lib/helpers/hooks";
import { isString } from "@/src/lib/helpers/verifications";

const emptyItem = {
  image: undefined,
  url: "",
  title: "",
  description: "",
  additionalDescription: "",
};

function serviceConverter(inputItem: UploadsFile | undefined): Service {
  const item = getNormalFile(inputItem);

  return {
    ...emptyItem,
    title: item?.metadata?.title ?? "",
    description: item?.metadata?.description ?? "",
    additionalDescription: item?.metadata?.additionalDescription ?? "",
    url: item ? getUploadAPIFilePath(item.id) : "",
  };
}

const UpdateServices: React.FC = () => {
  const { files: { services: servicesData = [] } = {} } = useUploadData();
  const { categoryManager, files } = useFileManager("services", servicesData);

  const count = uploadsCategoryConfig.services?.maxCount ?? 0;

  const [APIServices, setAPIServices] = useState<Service[]>(
    createArray(count, (index) => {
      const item = files.find((item) => item.index === index);
      return serviceConverter(item);
    })
  );
  const [services, setServices] = useState<Service[]>(
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

  const resetServices = async () => {
    try {
      await categoryManager.retrieveFiles();
      const newItems = categoryManager.getFiles().map(serviceConverter);

      setAPIServices(newItems);
      setServices(createArray(count, () => emptyItem));
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
      const updatedServices = [...services];
      updatedServices[index] = { ...updatedServices[index], image: file, url };
      setServices(updatedServices);
      clearMessages();
    }

    // @ts-expect-error Invalid Type
    e.target.value = null;
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      title: e.target.value,
    };
    setServices(updatedServices);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      description: e.target.value,
    };
    setServices(updatedServices);
  };

  const handleAdditionalDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      additionalDescription: e.target.value,
    };
    setServices(updatedServices);
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...emptyItem };
    setServices(updatedServices);
    clearMessages();
  };

  const handleClearAll = () => {
    resetServices();
    setSuccessMessage("Tüm hizmetler temizlendi.");
  };

  const handleUpdate = async () => {
    const completedService = services.some((service, index) => {
      const apiItem = APIServices[index];
      return apiItem
        ? service.image ||
            service.title ||
            service.description ||
            service.additionalDescription
        : service.image &&
            service.title &&
            service.description &&
            service.additionalDescription;
    });

    if (!completedService) {
      return setErrorMessage(
        "Lütfen en az bir alanın fotoğrafını, başlığını ve açıklamasını doldurun."
      );
    }

    const updatedServices = services
      .map(({ image, title, description, additionalDescription }, index) => ({
        id: files.find((item) => item.index === index)?.id,
        index,
        file: image,
        metadata: removeNullishValues({
          title,
          description,
          additionalDescription,
        }),
      }))
      .filter(
        ({ file, metadata }) =>
          file ||
          metadata.title ||
          metadata.description ||
          metadata.additionalDescription
      );

    const { error } = await categoryManager.updateFiles(updatedServices);

    if (isString(error)) return setErrorMessage(error);

    resetServices();
    setSuccessMessage("Hizmetler başarıyla güncellendi!");
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
    <div className={styles.servicesContainer}>
      <div className={styles.outerBox}>
        <h1>Hizmetleri Güncelle</h1>
        <p className={styles.infoText}>
          {count} adet hizmet için fotoğraf, başlık ve açıklama girin.
        </p>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        <div className={styles.gridContainer}>
          {services.map((service, index) => {
            const apiItem = APIServices[index];
            const url = service.url || apiItem.url;
            const image = service.image || apiItem.image;
            const title = service.title || apiItem.title;
            const description = service.description || apiItem.description;
            const additionalDescription =
              service.additionalDescription || apiItem.additionalDescription;

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
                      alt={`Service ${index + 1}`}
                      className={styles.serviceImage}
                    />
                  )}
                  {image && (
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={styles.removeIcon}
                      onClick={() => handleRemoveService(index)}
                    />
                  )}
                  {url ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
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
                <textarea
                  placeholder="Detaylı Açıklama Girin"
                  value={additionalDescription}
                  onChange={(e) => handleAdditionalDescriptionChange(e, index)}
                  className={styles.additionalDescriptionInput}
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

export default UpdateServices;
