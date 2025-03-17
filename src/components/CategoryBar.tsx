/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import styles from "../styles/components/CategoryBar.module.scss";
import ProductModal from "./ProductModal";
import { createArray } from "../lib/helpers/objects";
import type { ProductCategory } from "../@types/database";
import LoadingElement from "./LoadingElement";
import {
  getProductCategories,
  getUploadAPIFilePath,
  getUploadsCategories,
} from "../lib/helpers/api";
import type { APIProduct } from "../@types/components";

const ITEMS_PER_PAGE = 24;

const CategoryBar: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(
    null
  );
  const [categoryProducts, setCategoryProducts] = useState<APIProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<APIProduct | null>(
    null
  );
  const [visibleCategories, setVisibleCategories] = useState(4);

  const loadProducts = async (category: ProductCategory): Promise<void> => {
    const uploadCategoryString = `products/${category.id}`;
    const products = (await getUploadsCategories(uploadCategoryString))[
      uploadCategoryString
    ] as APIProduct[];
    setCategoryProducts(products);
  };

  const loadCategories = async (firstLoad = true): Promise<void> => {
    const result = (await getProductCategories()).sort(
      (a, b) => a.index - b.index
    );

    if (firstLoad && result.length) {
      setActiveCategory(result[0]);
    }

    setCategories(result);
  };

  const closeModal = () => setSelectedProduct(null);

  useEffect(() => {
    const updateVisibleCategories = () => {
      setVisibleCategories(
        window.innerWidth < 768 ? 2 : categories.length || 4
      );
    };

    window.addEventListener("resize", updateVisibleCategories);
    updateVisibleCategories();
    return () => window.removeEventListener("resize", updateVisibleCategories);
  }, [categories]);

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    if (activeCategory) loadProducts(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (!activeCategory || !categories.length) return <LoadingElement />;

  const totalPages = Math.ceil(categoryProducts.length / ITEMS_PER_PAGE);
  const currentProducts = categoryProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.categoriesContainer}>
        <div className={styles.swipeHint}>
          <span>← Kategoriler arasında geçiş yapmak için kaydırın →</span>
        </div>

        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <li
              key={category.id}
              className={`${styles.categoryItem} ${
                activeCategory === category ? styles.active : ""
              }`}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
            >
              {category.name}
            </li>
          ))}
          <div
            className={styles.activeIndicator}
            style={
              {
                transform: `translateX(${
                  categories.indexOf(activeCategory) * (100 / visibleCategories)
                }%)`,
                width: `${100 / visibleCategories}%`,
              } as React.CSSProperties
            }
          />
        </ul>

        <div className={styles.productGrid}>
          {currentProducts.map((product, index) => (
            <div
              key={index}
              className={styles.productItem}
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={getUploadAPIFilePath(product.id)}
                alt={product.metadata?.name}
                className={styles.productImage}
                loading="lazy"
              />
              <p className={styles.productName}>{product.metadata?.name}</p>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          {totalPages > 1 && (
            <div className={styles.paginationWrapper}>
              <button
                className={styles.pageButton}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Önceki
              </button>
              <div className={styles.pageNumbers}>
                {createArray(totalPages, (i) => (
                  <button
                    key={i + 1}
                    className={`${styles.pageNumber} ${
                      currentPage === i + 1 ? styles.activePage : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className={styles.pageButton}
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Sonraki
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default CategoryBar;
