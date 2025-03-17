import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBars,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/src/styles/admin/products/UpdateCatalog.module.scss";
import { useFileManager, useMessageState } from "@/src/lib/helpers/hooks";
import { useUploadData } from "../../utils/UploadData";
import { isString } from "@/src/lib/helpers/verifications";
import { getUploadAPIFilePath } from "@/src/lib/helpers/api";
import type { GetDocument } from "@/src/@types/components";

const DEFAULT_WORKER_SRC = "/pdf.worker.min.js";

const UpdateCatalog: React.FC = () => {
  const { files: { catalog: catalogs } = {} } = useUploadData();
  const { categoryManager, files } = useFileManager("catalog", catalogs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catalog, setCatalog] = useState<File | null>(null);
  const [activeDrag, setActiveDrag] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [tempFirstPage, setTempFirstPage] = useState<string>();
  const [firstPageMap, setFirstPageMap] = useState<
    Partial<Record<string, string>>
  >({});
  const [pdfIds, setPdsIds] = useState<string[]>(files.map(({ id }) => id));

  const {
    setErrorMessage,
    setSuccessMessage,
    clearMessages,
    errorMessage,
    successMessage,
  } = useMessageState();

  const renderPage = async (
    getDocument: GetDocument,
    url: string
  ): Promise<string | undefined> => {
    const pdf = await getDocument(url).promise;
    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await firstPage.render({ canvasContext: context, viewport }).promise;
    return canvas.toDataURL();
  };

  const createDocumentReader = async () => {
    // @ts-expect-error bad import path
    const pdfjsLib = await import("pdfjs-dist/build/pdf");
    pdfjsLib.GlobalWorkerOptions.workerSrc = DEFAULT_WORKER_SRC;
    const { getDocument } = await import("pdfjs-dist");
    return { getDocument };
  };

  useEffect(() => {
    setTempFirstPage(undefined);
  }, [isModalOpen]);

  useEffect(() => {
    (async () => {
      const { getDocument } = await createDocumentReader();
      const newIds: Partial<Record<string, string>> = {};

      for (const id of pdfIds) {
        if (firstPageMap[id]) continue;

        const pageDataUrl = await renderPage(
          getDocument,
          getUploadAPIFilePath(id)
        );

        if (!pageDataUrl) continue;

        newIds[id] = pageDataUrl;
      }

      const finalIds = Object.entries({ ...firstPageMap, ...newIds }).reduce(
        (total, current) => {
          const data = files.find(({ id }) => id === current[0]);
          return data ? { ...total, [current[0]]: current[1] } : total;
        },
        {}
      );

      setFirstPageMap(finalIds);
    })();
  }, [pdfIds]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUploading(true);

    const file =
      "dataTransfer" in e
        ? e.dataTransfer.files?.[0]
        : (e.target as HTMLInputElement).files?.[0];

    if (file && file.type === "application/pdf") {
      setCatalog(file);

      const { getDocument } = await createDocumentReader();
      const pageDataUrl = await renderPage(
        getDocument,
        URL.createObjectURL(file)
      );
      setTempFirstPage(pageDataUrl);

      clearMessages();
    } else {
      setErrorMessage("Lütfen yalnızca PDF formatında bir dosya yükleyin.");
      setIsModalOpen(false);
    }

    setIsUploading(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDrag(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDrag(false);
  };

  const handleRemoveCatalog = async (index: number) => {
    const catalog = files.find((_, i) => i === index);

    if (!catalog) return setErrorMessage("Katalog bulunamadı");

    const result = await categoryManager.delete(catalog.id);

    if (isString(result)) return setErrorMessage(result);

    clearMessages();
    setPdsIds((prev) => prev.filter((id) => id !== catalog.id));
  };

  const handleUpload = async () => {
    if (!catalog) {
      return setErrorMessage("Lütfen bir katalog yükleyin.");
    }

    const result = await categoryManager.post([
      { file: catalog, index: files.length },
    ]);

    if (isString(result)) {
      setErrorMessage(result);
      return setIsModalOpen(false);
    }

    setCatalog(null);
    setSuccessMessage("Katalog başarıyla güncellendi!");
    setIsModalOpen(false);
    setPdsIds(result.map(({ id }) => id));
  };

  const handleReorder = async (startIndex: number, endIndex: number) => {
    const result = Array.from(files.toSorted((a, b) => a.index - b.index));
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const finalResult = result.map(({ id }, index) => ({ id, index }));
    const reorderResult = await categoryManager.patch(finalResult);

    if (isString(reorderResult)) return setErrorMessage(reorderResult);

    clearMessages();
  };

  return (
    <div className={styles.updateCatalogContainer}>
      <div className={styles.outerBox}>
        <h1>Kataloğu Güncelle</h1>
        <p className={styles.infoText}>
          Kataloğunuzu yüklemek için sürükleyip bırakın veya dosya seçin.
        </p>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Katalog Yükle
        </button>

        <div className={styles.catalogList}>
          {files
            .toSorted((a, b) => a.index - b.index)
            .map((catalog, index) => (
              <div
                key={catalog.id}
                className={styles.catalogItem}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", index.toString())
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const startIndex = parseInt(
                    e.dataTransfer.getData("text/plain")
                  );
                  const endIndex = index;
                  handleReorder(startIndex, endIndex);
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <FontAwesomeIcon icon={faBars} className={styles.dragHandle} />
                <img
                  src={
                    firstPageMap[catalog.id] ?? "/category-system/sample.jpg"
                  }
                  alt="PDF Preview"
                  className={styles.previewImage}
                />
                <p>{`afra-catalog-${index + 1}.pdf`}</p>
                <FontAwesomeIcon
                  icon={faTrash}
                  className={`${styles.deleteIcon} mr-6`}
                  onClick={() => handleRemoveCatalog(index)}
                />
              </div>
            ))}
        </div>

        {isModalOpen && (
          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Katalog Yükle</h3>
              <div
                className={`${styles.uploadArea} ${
                  activeDrag ? styles.drag : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileUpload}
              >
                {catalog ? (
                  <div className={styles.filePreview}>
                    <div className={styles.previewContainer}>
                      <img
                        src={tempFirstPage}
                        alt="PDF Preview"
                        className={styles.previewImage}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={styles.removeIcon}
                        onClick={() => {
                          setCatalog(null);
                          setTempFirstPage(undefined);
                        }}
                      />
                    </div>
                    <p>{catalog.name}</p>
                  </div>
                ) : (
                  <label className={styles.uploadPlaceholder}>
                    <FontAwesomeIcon
                      icon={faUpload}
                      className={styles.uploadIcon}
                    />
                    <span>PDF Yükle</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e)}
                      className={styles.hiddenInput}
                    />
                  </label>
                )}
              </div>
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  İptal
                </button>
                <button
                  className={styles.confirmButton}
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  Kataloğa Ekle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateCatalog;
