import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../../styles/admin/products/ManageProducts.module.scss";
import { useUploadData } from "../../utils/UploadData";
import {
  getProductCategories,
  getUploadAPIFilePath,
} from "@/src/lib/helpers/api";
import type { ProductCategory } from "@/src/@types/database";
import type { Product, ProductFormData } from "@/src/@types/components";
import LoadingElement from "../../LoadingElement";
import { pick, removeNullishValues } from "@/src/lib/helpers/objects";
import { isString } from "@/src/lib/helpers/verifications";
import { useFileManager } from "@/src/lib/helpers/hooks";

const PRODUCTS_PER_PAGE = 10;

const ManageProducts: React.FC = () => {
  const router = useRouter();

  const { categoryId } = router.query;
  const { files: { [`products/${categoryId}`]: categoryFiles = [] } = {} } =
    useUploadData();

  const { categoryManager, files: f } = useFileManager(
    `products/${categoryId}`,
    categoryFiles
  );

  const files = f as Product[];

  const [productCategory, setProductCategory] = useState<
    ProductCategory | null | undefined
  >(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setDragging] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete">();

  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [formData, setFormData] = useState<ProductFormData>();
  const [errorMessage, setErrorMessage] = useState("");

  const totalPages = Math.ceil(files.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    (async () => {
      const result = await getProductCategories();
      const category = result.find((cat) => cat.id === categoryId);

      setProductCategory(category);
    })();
  }, []);

  if (productCategory === null) return <LoadingElement />;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedProducts = files.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const openDeleteModal = (product: Product) => {
    setModalType("delete");
    setIsModalOpen(true);
    setSelectedProduct(product);
  };

  const openAddModal = () => {
    setModalType("add");
    setIsModalOpen(true);
    setSelectedProduct(undefined);
    setFormData({
      image: { url: "/category-system/sample.jpg" },
      metadata: { name: "" },
    });
  };

  const openEditModal = (product: Product) => {
    setModalType("edit");
    setIsModalOpen(true);
    setSelectedProduct(product);
    setFormData({
      image: {
        url: product.id
          ? getUploadAPIFilePath(product.id)
          : "/category-system/sample.jpg",
      },
      metadata: product.metadata,
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(undefined);
    setSelectedProduct(undefined);
    setDragging(false);
    setErrorMessage("");
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formEditFunction = (prev: ProductFormData | undefined) =>
      prev
        ? { ...prev, metadata: { ...prev.metadata, [name]: value } }
        : undefined;

    setFormData(formEditFunction);
  };

  const uploadHandler = (
    e: React.DragEvent<HTMLDivElement> | React.FormEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const file =
      "dataTransfer" in e
        ? e.dataTransfer.files?.[0]
        : (e.target as HTMLInputElement).files?.[0];

    if (!file) return;

    const { type: fileType } = file;

    if (!fileType.startsWith("image"))
      return setErrorMessage(
        "Yüklenen dosyanın bir görsel olması gerekmektedir."
      );

    const url = URL.createObjectURL(file);

    setFormData((prev) =>
      prev ? { ...prev, image: { url, data: file } } : undefined
    );

    // @ts-expect-error Invalid Type
    e.target.value = "";
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    const result = await categoryManager.delete(selectedProduct.id);

    if (isString(result)) return setErrorMessage(result);

    closeModal();
  };

  const handleUpdateProduct = async () => {
    if (!formData || !selectedProduct) return;

    const { metadata } = formData;

    if (!metadata.name?.length)
      return setErrorMessage("Ürün adı doldurulmalıdır.");

    const imageData = formData.image.data;

    const { id } = selectedProduct;
    const fetchMetadata = removeNullishValues(
      pick(metadata, [
        "name",
        "code",
        "color",
        "material",
        "power",
        "dimensions",
        "price",
      ]),
      [""]
    );

    const result = categoryManager.patch([
      { id, file: imageData, metadata: fetchMetadata },
    ]);

    if (isString(result)) return setErrorMessage(result);

    closeModal();
  };

  const handleAddProduct = async () => {
    if (!formData) return;

    const { metadata, image } = formData;

    if (!metadata.name?.length)
      return setErrorMessage("Ürün adı doldurulmalıdır.");

    if (!image.data) return setErrorMessage("Ürün görseli doldurulmalıdır.");

    const result = await categoryManager.post([
      {
        file: image.data,
        index: files.length,
        metadata: removeNullishValues(
          pick(metadata, [
            "name",
            "code",
            "color",
            "material",
            "power",
            "dimensions",
            "price",
          ]),
          [""]
        ),
      },
    ]);

    if (isString(result)) return setErrorMessage(result);

    closeModal();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {productCategory && (
          <h2 className={styles.categoryTitle}>
            &quot;{productCategory?.name}&quot; Kategorisindeki Ürünleri Yönet
          </h2>
        )}
        <div className={styles.headerLeft}>
          {productCategory && (
            <button className={styles.addButton} onClick={openAddModal}>
              + Ürün Ekle
            </button>
          )}
          <button
            className={styles.backButton}
            onClick={() => router.push("/dashboard/products/update-categories")}
          >
            Kategorilere Dön
          </button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className={styles.noProductMessage}>
          {productCategory ? (
            <p>Bu kategoride hiç ürün yok 😔</p>
          ) : (
            <p>Bu kategori bulunmamaktadır 😔</p>
          )}
          <p>
            {productCategory &&
              'Yeni ürün eklemek için "+ Ürün Ekle" butonunu kullanabilirsiniz.'}
          </p>
        </div>
      ) : (
        <ul className={styles.productList}>
          {paginatedProducts.map((product) => (
            <li key={product.id} className={styles.productItem}>
              <img
                src={
                  product.id
                    ? getUploadAPIFilePath(product.id)
                    : "/category-system/sample.jpg"
                }
                alt={product.metadata.name}
                className={styles.productIcon}
              />
              <span className={styles.productName}>
                {product.metadata.name}
              </span>
              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => openEditModal(product)}
                >
                  Ürünü Yönet
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => openDeleteModal(product)}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.pagination}>
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>
            Önceki
          </button>
        )}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? styles.activePage : ""}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>
            Sonraki
          </button>
        )}
      </div>

      {isModalOpen && modalType === "edit" && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Ürün Düzenleniyor</h3>
            <div className={styles.modalBody}>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="addItem"
                onInput={uploadHandler}
              />
              <label htmlFor="addItem">
                <img
                  src={formData?.image.url || "/category-system/sample.jpg"}
                  alt="Ürün"
                  className={`cursor-pointer w-52 h-52 object-cover border-dashed rounded-md border-2 p-1 hover:border-blue-600  ${
                    isDragging
                      ? "bg-gray-200 border-blue-600"
                      : "border-gray-300"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    uploadHandler(e);
                  }}
                />
              </label>
              {/* <img
                src={formData?.image.url}
                alt="Ürün"
                className={styles.productImageLarge}
              /> */}
              <div className={styles.productDetails}>
                <div className={styles.formGroup}>
                  <div className={styles.inputContainer}>
                    <label>Ürün Adı</label>
                    <input
                      type="text"
                      name="name"
                      value={formData?.metadata.name || ""}
                      onChange={inputHandler}
                      placeholder="Ürün Adı"
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label>Ürün Kodu</label>
                    <input
                      type="text"
                      name="code"
                      value={formData?.metadata?.code || ""}
                      onChange={inputHandler}
                      placeholder="Ürün Kodu"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.inputContainer}>
                    <label>Ürün Rengi</label>
                    <input
                      type="text"
                      name="color"
                      value={formData?.metadata?.color || ""}
                      onChange={inputHandler}
                      placeholder="Ürün Rengi"
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label>Materyal</label>
                    <input
                      type="text"
                      name="material"
                      value={formData?.metadata?.material || ""}
                      onChange={inputHandler}
                      placeholder="Materyal"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.inputContainer}>
                    <label>Güç</label>
                    <input
                      type="text"
                      name="power"
                      value={formData?.metadata?.power || ""}
                      onChange={inputHandler}
                      placeholder="Güç"
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label>Boyutlar</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData?.metadata?.dimensions || ""}
                      onChange={inputHandler}
                      placeholder="Boyutlar"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.inputContainerFull}>
                    <label>Fiyat</label>
                    <input
                      type="text"
                      name="price"
                      value={formData?.metadata?.price || ""}
                      onChange={inputHandler}
                      placeholder="Fiyat"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeModal}>
                İptal
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleUpdateProduct}
              >
                Ürünü Güncelle
              </button>
            </div>

            {errorMessage && (
              <div className="text-center text-red-600">
                <p className="pt-2">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && modalType === "add" && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Yeni Ürün Ekle</h3>
            <div className={styles.modalBody}>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="addItem"
                onInput={(e) => uploadHandler(e)}
              />
              <label htmlFor="addItem">
                <img
                  src={formData?.image.url || "/category-system/sample.jpg"}
                  alt="Ürün"
                  className={`cursor-pointer w-52 h-52 object-cover border-dashed rounded-md border-2 p-1 hover:border-blue-600 ${
                    isDragging
                      ? "bg-gray-200 border-blue-600"
                      : "border-gray-300"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    uploadHandler(e);
                  }}
                />
              </label>

              <div className={styles.productDetails}>
                <div className={styles.formGroup}>
                  <div className={styles.inputContainer}>
                    <label>Ürün Adı</label>
                    <input
                      type="text"
                      name="name"
                      value={formData?.metadata?.name || ""}
                      onChange={inputHandler}
                      placeholder="Ürün Adı"
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label>Ürün Kodu</label>
                    <input
                      type="text"
                      name="code"
                      value={formData?.metadata?.code || ""}
                      onChange={inputHandler}
                      placeholder="Ürün Kodu"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.inputContainer}>
                    <label>Ürün Rengi</label>
                    <input
                      type="text"
                      name="color"
                      value={formData?.metadata?.color || ""}
                      onChange={inputHandler}
                      placeholder="Ürün Rengi"
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label>Materyal</label>
                    <input
                      type="text"
                      name="material"
                      value={formData?.metadata?.material || ""}
                      onChange={inputHandler}
                      placeholder="Materyal"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.inputContainer}>
                    <label>Güç</label>
                    <input
                      type="text"
                      name="power"
                      value={formData?.metadata?.power || ""}
                      onChange={inputHandler}
                      placeholder="Güç"
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label>Boyutlar</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData?.metadata?.dimensions || ""}
                      onChange={inputHandler}
                      placeholder="Boyutlar"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.inputContainerFull}>
                    <label>Fiyat</label>
                    <input
                      type="text"
                      name="price"
                      value={formData?.metadata?.price || ""}
                      onChange={inputHandler}
                      placeholder="Fiyat"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeModal}>
                İptal
              </button>
              <button
                onClick={handleAddProduct}
                className={styles.confirmButton}
              >
                Ürünü Ekle
              </button>
            </div>

            {errorMessage && (
              <div className="text-center text-red-600">
                <p className="pt-2">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && modalType === "delete" && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalWarningTitle}>UYARI!</h3>
            <p className={styles.warningText}>
              Bu ürünü silmek istediğinizden emin misiniz?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeModal}>
                İptal
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleDeleteProduct}
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

export default ManageProducts;
