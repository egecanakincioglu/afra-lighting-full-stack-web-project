/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../styles/components/ProductModal.module.scss";
import type { ProductModalProps } from "../@types/components";
import { getUploadAPIFilePath } from "../lib/helpers/api";
import { useRouter } from "next/navigation";

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const router = useRouter();

  const handleTeklifAl = (id: string) => {
    router.push(`/contact?productId=${id}`);
  };

  const metadata = product.metadata!;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
        <div className={styles.modalInner}>
          <img
            src={getUploadAPIFilePath(product.id)}
            alt={metadata.name}
            className={styles.modalImage}
          />
          <div className={styles.productDetails}>
            <ul className={styles.productInfo}>
              <li>
                <strong>Ürün Adı:</strong> {metadata.name}
              </li>
              {metadata.code && (
                <li>
                  <strong>Ürün Kodu:</strong> {metadata.code}
                </li>
              )}
              {metadata.color && (
                <li>
                  <strong>Ürün Rengi:</strong> {metadata.color}
                </li>
              )}
              {metadata.material && (
                <li>
                  <strong>Materyal:</strong> {metadata.material}
                </li>
              )}
              {metadata.power && (
                <li>
                  <strong>Güç:</strong> {metadata.power}
                </li>
              )}
              {metadata.dimensions && (
                <li>
                  <strong>Boyutlar:</strong> {metadata.dimensions}
                </li>
              )}
              {metadata.price && (
                <li>
                  <strong>Ürün Fiyatı:</strong> {metadata.price} ₺
                </li>
              )}
            </ul>
            <button
              className={styles.teklifAlButton}
              onClick={() => handleTeklifAl(product.id)}
            >
              Teklif Al
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
