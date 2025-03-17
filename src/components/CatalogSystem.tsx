import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ProductsTitle from "./ProductsTitle";
import PDFBookViewer from "./PDFBookViewer";
import styles from "../styles/pages/MainPage.module.scss";
import { useUploadData } from "./utils/UploadData";
import buttonStyles from "../styles/admin/products/UpdateCatalog.module.scss";
import { getUploadAPIFilePath } from "../lib/helpers/api";
import { useRouter } from "next/router";
import { isString } from "../lib/helpers/verifications";

const CatalogSystem: React.FC = () => {
  const { files = {} } = useUploadData();
  const router = useRouter();

  const { catalogIndex = 0 } = router.query;

  const catalogs = files.catalog ?? [];
  const catalogCount = catalogs.length;

  const [activeCatalogIndex, setActiveCatalogIndex] = useState<number>(
    isString(catalogIndex)
      ? +catalogIndex < catalogCount
        ? +catalogIndex
        : 0
      : 0
  );

  const activePdf = catalogs.find((item) => item.index === activeCatalogIndex);
  const pdfPath = activePdf ? getUploadAPIFilePath(activePdf?.id) : "";

  const nextCatalog = () => {
    if (activeCatalogIndex < catalogCount) {
      setActiveCatalogIndex(activeCatalogIndex + 1);
    }
  };

  const previousCatalog = () => {
    if (activeCatalogIndex > 0) {
      setActiveCatalogIndex(activeCatalogIndex - 1);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div
        className={styles.generalSection}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <ProductsTitle />
        {catalogCount === 0 ? (
          <p className="self-center text-2xl">Hiçbir katalog bulunamadı.</p>
        ) : (
          <PDFBookViewer key={pdfPath} pdfUrl={pdfPath} />
        )}

        <div
          style={{
            flexGrow: 1,
          }}
        ></div>

        <div
          style={{
            marginTop: "1vh",
            marginBottom: "1vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "1vh",
            zIndex: 9999,
          }}
        >
          {activeCatalogIndex > 0 && (
            <button
              onClick={previousCatalog}
              className={buttonStyles.pageButton}
            >
              Önceki Katalog
            </button>
          )}

          {catalogCount > activeCatalogIndex + 1 && (
            <button onClick={nextCatalog} className={buttonStyles.pageButton}>
              Sonraki Katalog
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CatalogSystem;
