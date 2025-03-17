/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "@/src/styles/admin/SiteSettings/UpdateFavorites.module.scss";
import type { FavoriteProduct } from "@/src/@types/components";
import type { UploadsFile } from "@/src/@types/database";
import {
  createArray,
  getNormalFile,
  removeNullishValues,
} from "@/src/lib/helpers/objects";
import { getUploadAPIFilePath } from "@/src/lib/helpers/api";
import { uploadsCategoryConfig } from "@/src/lib/config/files";
import { useUploadData } from "../../utils/UploadData";
import { useFileManager, useMessageState } from "@/src/lib/helpers/hooks";
import { isString } from "@/src/lib/helpers/verifications";

const emptyItem = { image: undefined, title: undefined, url: undefined };

function favoriteConverter(
  inputItem: UploadsFile | undefined
): FavoriteProduct {
  const item = getNormalFile(inputItem);

  return {
    ...emptyItem,
    title: item?.metadata?.title,
    url: item ? getUploadAPIFilePath(item.id) : undefined,
  };
}

const UpdateFavorite: React.FC = () => {
  const { files: { favorites } = {} } = useUploadData();
  const { categoryManager, files } = useFileManager("favorites", favorites);

  const count = uploadsCategoryConfig.favorites?.maxCount ?? 0;

  const [APIProducts, setAPIProducts] = useState<FavoriteProduct[]>(
    createArray(count, (index) => {
      const item = files.find((item) => item.index === index);
      return favoriteConverter(item);
    })
  );
  const [products, setProducts] = useState<FavoriteProduct[]>(
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

  const resetProducts = async () => {
    try {
      await categoryManager.retrieveFiles();
      const newItems = categoryManager.getFiles().map(favoriteConverter);

      setAPIProducts(newItems);
      setProducts(createArray(count, () => emptyItem));
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
      const updatedProducts = products.map((item, i) =>
        i === index ? { ...item, image: file, url } : item
      );
      setProducts(updatedProducts);
      clearMessages();
    }
    // @ts-expect-error Invalid Type
    e.target.value = null;
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedProducts = products.map((item, i) =>
      i === index ? { ...item, title: e.target.value } : item
    );

    setProducts(updatedProducts);
    clearMessages();
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = products.map((item, i) =>
      i === index ? APIProducts.at(index) ?? emptyItem : item
    );
    setProducts(updatedProducts);
    clearMessages();
  };

  const handleClearAll = () => {
    resetProducts();
    setSuccessMessage("Tüm ürünler temizlendi.");
  };

  const handleUpdate = async () => {
    const completedProduct = products.some((product, index) => {
      const apiItem = APIProducts[index];
      return apiItem
        ? product.image || product.title
        : product.image && product.title;
    });

    if (!completedProduct) {
      return setErrorMessage(
        "Lütfen en az bir fotoğrafla ismini girin veya mevcut ürünlerden birini düzenleyin."
      );
    }

    const updatedProducts = products
      .map(({ image, title }, index) => ({
        id: files.find((file) => file.index === index)?.id,
        file: image,
        index,
        metadata: removeNullishValues({ title }),
      }))
      .filter(({ file, metadata }) => file || metadata.title);

    const { error } = await categoryManager.updateFiles(updatedProducts);

    if (isString(error)) return setErrorMessage(error);

    resetProducts();
    setSuccessMessage("Favori ürünler başarıyla güncellendi!");
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
    <div className={styles.favoriteProductsContainer}>
      <div className={styles.outerBox}>
        <h1>Favori Ürünler</h1>
        <p className={styles.infoText}>
          Yüklemek istediğiniz {count} adet öne çıkan ürünün fotoğrafını
          sürükleyerek veya yükleyerek ekleyin.
        </p>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        <div className={styles.gridContainer}>
          {products.map((product, index) => {
            const apiItem = APIProducts[index];
            const url = product.url || apiItem.url;
            const image = product.image || apiItem.image;
            const title = product.title || apiItem.title;

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
                      alt={`Product ${index + 1}`}
                      className={styles.productImage}
                    />
                  )}
                  {image && (
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={styles.removeIcon}
                      onClick={() => handleRemoveProduct(index)}
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
                  placeholder="Ürün İsmi Girin"
                  value={title}
                  onChange={(e) => handleNameChange(e, index)}
                  className={styles.productNameInput}
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

export default UpdateFavorite;
