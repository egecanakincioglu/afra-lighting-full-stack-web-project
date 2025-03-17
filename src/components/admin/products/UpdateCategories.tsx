/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../../styles/admin/products/UpdateCategories.module.scss";
import { productCategoryMaxCount } from "@/src/lib/config/files";
import type { ProductCategory } from "@/src/@types/database";
import {
  deleteProductCategories,
  getProductCategories,
  patchProductCategories,
  postProductCategories,
} from "@/src/lib/helpers/api";
import LoadingElement from "../../LoadingElement";

const UpdateCategories: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "rename" | "delete" | "">(
    ""
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const newCategories = await getProductCategories();
      setCategories(newCategories);
    })();
  }, []);

  if (!categories) return <LoadingElement />;

  const openModal = (
    type: "add" | "rename" | "delete",
    category?: ProductCategory
  ) => {
    setModalType(type);
    setIsModalOpen(true);
    setCategoryName(category ? category.name : "");
    setSelectedCategory(category || null);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setSelectedCategory(null);
    setError("");
  };

  const handleAddCategory = async () => {
    if (categories.length >= productCategoryMaxCount)
      return setError("Kategori limiti doldu!");

    if (categoryName.trim() === "") return setError("Kategori adı boş olamaz!");

    const result = await postProductCategories({
      name: categoryName.trim(),
      index: categories.length,
    });

    if (!result) return setError("Kategori oluşturulamadı.");

    setCategories([...categories, result]);
    closeModal();
  };

  const handleRenameCategory = async () => {
    const name = categoryName.trim();

    if (!name.length) return setError("Kategori adı boş olamaz!");

    const id = selectedCategory?.id;

    if (!id)
      return setError(
        "İsim değiştireceğiniz kategorinin yanındaki isim değiştirme tuşuna tıklayınız."
      );

    const result = await patchProductCategories({
      id: selectedCategory!.id!,
      data: {
        name: categoryName,
      },
    });

    if (!result) return setError("Kategori yeniden adlandırılamadı.");

    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, name } : category
      )
    );
    closeModal();
  };

  const handleDeleteCategory = async () => {
    const id = selectedCategory?.id;

    if (!id)
      return setError(
        "Sileceğiniz kategorinin yanındaki silme tuşuna tıklayınız."
      );

    const result = await deleteProductCategories({ id });

    if (!result) return setError("Kategori silinemedi.");

    setCategories(categories.filter((category) => category.id !== id));
    closeModal();
  };

  const handleManageProducts = (categoryId: string) => {
    router.push({
      pathname: "/dashboard/products/manage-products",
      query: { categoryId },
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button
          className={styles.addButton}
          onClick={() => openModal("add")}
          disabled={categories.length >= productCategoryMaxCount}
        >
          + Kategori Ekle ({categories.length}/{productCategoryMaxCount})
        </button>
      </div>

      {categories.length === 0 ? (
        <div className={styles.noCategoryMessage}>
          <p>Burada hiç kategori yok 😔</p>
        </div>
      ) : (
        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <li key={category.id} className={styles.categoryItem}>
              <span className={styles.categoryName}>{category.name}</span>
              <div className={styles.actions}>
                <button
                  className={styles.manageButton}
                  onClick={() => handleManageProducts(category.id)}
                >
                  Ürünleri Yönet
                </button>
                <button
                  className={styles.renameButton}
                  onClick={() => openModal("rename", category)}
                >
                  Yeniden Adlandır
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => openModal("delete", category)}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && modalType !== "delete" && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>
              {modalType === "add"
                ? "Yeni Kategori Ekle"
                : "Kategoriyi Düzenle"}
            </h3>
            <input
              type="text"
              placeholder="Kategori adı girin..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
                  modalType === "add" ? handleAddCategory : handleRenameCategory
                }
              >
                {modalType === "add" ? "Kategori Ekle" : "Kategoriyi Güncelle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && modalType === "delete" && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalWarningTitle}>UYARI!</h2>
            <h3 className={styles.modalTitle}>
              &quot;{selectedCategory?.name}&quot; kategorisini silmek
              istediğinize emin misiniz?
            </h3>
            <p className={styles.warningText}>
              Eğer bu kategoriyi silerseniz, kategoriye ait <b>tüm ürünler</b>{" "}
              silinecektir!
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeModal}>
                İptal
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleDeleteCategory}
              >
                Kategoriyi Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCategories;
