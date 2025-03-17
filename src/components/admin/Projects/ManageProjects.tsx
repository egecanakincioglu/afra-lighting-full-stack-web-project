import React, { useState, useCallback } from "react";
import styles from "../../../styles/admin/Projects/ManageProjects.module.scss";
import type {
  UpdateFilesInput,
  UpdateFilesPostInput,
} from "@/src/@types/database";
import { useUploadData } from "../../utils/UploadData";
import { useFileManager } from "@/src/lib/helpers/hooks";
import { getUploadAPIFilePath } from "@/src/lib/helpers/api";
import { isString } from "@/src/lib/helpers/verifications";
import type { UploadsFilePatchSchema } from "@/src/modules/api/schemas";
import { projectsConverter } from "@/src/lib/helpers/converters";
import type { Project, UploadedImage } from "@/src/@types/components";

const ManageProjects: React.FC = () => {
  const { files: { projects: projectsData = [] } = {} } = useUploadData();
  const { categoryManager, files } = useFileManager("projects", projectsData);
  const [projects, setProjects] = useState<Project[]>(projectsConverter(files));

  const [errorMessage, setErrorMessage] = useState<string>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "">("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [beforeImage, setBeforeImage] = useState<UploadedImage>();
  const [afterImage, setAfterImage] = useState<UploadedImage>();
  const [title, setTitle] = useState<string>();
  const [details, setDetails] = useState<string>();

  const [currentPage, setCurrentPage] = useState(1);
  const PROJECTS_PER_PAGE = 10;

  const openModal = (type: "add" | "edit", project?: Project) => {
    setModalType(type);
    setIsModalOpen(true);
    setErrorMessage(undefined);

    if (type === "edit" && project) {
      setSelectedProject(project);
      setBeforeImage({ url: getUploadAPIFilePath(project.beforeImage.id) });
      setAfterImage({ url: getUploadAPIFilePath(project.afterImage.id) });
      setTitle(project.title);
      setDetails(project.details);
    } else {
      setBeforeImage(undefined);
      setAfterImage(undefined);
      setTitle(undefined);
      setDetails(undefined);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setBeforeImage(undefined);
    setAfterImage(undefined);
    setTitle(undefined);
    setDetails(undefined);
    setErrorMessage(undefined);
  };

  const handleImageUpload = useCallback(
    (file: File, type: "before" | "after") => {
      const url = URL.createObjectURL(file);
      const saveData = { file, url };

      if (type === "before") {
        setBeforeImage(saveData);
      } else {
        setAfterImage(saveData);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, type: "before" | "after") => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleImageUpload(file, type);
      }
    },
    [handleImageUpload]
  );

  const handleClick = useCallback(
    (type: "before" | "after") => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          handleImageUpload(file, type);
        }
      };
      input.click();
    },
    [handleImageUpload]
  );

  const handleRemoveImage = useCallback((type: "before" | "after") => {
    if (type === "before") {
      setBeforeImage(undefined);
    } else {
      setAfterImage(undefined);
    }
  }, []);

  const handleAddProject = async () => {
    if (!beforeImage?.file || !afterImage?.file || !title || !details) {
      setErrorMessage("Tüm alanları doldurmalısınız.");
      return;
    }

    const projectCount = projects.length;
    const lastIndex = projectCount * 2;

    const newImages = [
      {
        index: lastIndex,
        file: beforeImage.file,
        metadata: { title: title, description: details },
      },
      {
        index: lastIndex + 1,
        file: afterImage.file,
      },
    ] satisfies UpdateFilesPostInput[];

    const result = await categoryManager.post(newImages);

    if (isString(result)) return setErrorMessage(result);

    setProjects(projectsConverter(result));
    closeModal();
  };

  const handleEditProject = async () => {
    if (!selectedProject) return;

    const { beforeImage: firstImage, afterImage: secondImage } =
      selectedProject;

    const firstImageUpdate: UploadsFilePatchSchema = { id: firstImage.id };

    if (beforeImage?.file) firstImageUpdate.file = beforeImage.file;
    if (title)
      firstImageUpdate.metadata = { ...firstImageUpdate.metadata, title };
    if (details)
      firstImageUpdate.metadata = {
        ...firstImageUpdate.metadata,
        description: details,
      };

    const secondImageUpdate: UploadsFilePatchSchema = { id: secondImage.id };

    if (afterImage?.file) secondImageUpdate.file = afterImage.file;

    const updates = [firstImageUpdate, secondImageUpdate].filter(
      (item) => Object.entries(item).length > 1
    ) satisfies UpdateFilesInput[];

    const result = await categoryManager.patch(updates);

    if (isString(result)) return setErrorMessage(result);

    setProjects(projectsConverter(result));
    closeModal();
  };

  const handleDeleteProject = async (index: number) => {
    const selectedProject = projects.find((project) => project.index === index);

    if (!selectedProject) return;

    const { beforeImage, afterImage } = selectedProject;

    await categoryManager.delete(beforeImage.id);
    const result = await categoryManager.delete(afterImage.id);

    if (isString(result)) return setErrorMessage(result);

    setProjects(projects.filter((project) => project.index !== index));
  };

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const currentProjects = projects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          + Proje Ekle
        </button>
      </div>

      {projects.length === 0 ? (
        <div className={styles.noProjectMessage}>
          <p>Burada hiç proje yok 😔</p>
        </div>
      ) : (
        <ul className={styles.projectList}>
          {currentProjects.map((project) => (
            <li key={project.index} className={styles.projectItem}>
              <span className={styles.projectTitle}>{project.title}</span>
              <div className={styles.actions}>
                <button
                  className={styles.manageButton}
                  onClick={() => openModal("edit", project)}
                >
                  Projeyi Yönet
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteProject(project.index)}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>
              {modalType === "add" ? "Yeni Proje Ekle" : "Projeyi Düzenle"}
            </h3>

            <div className={styles.imageUploads}>
              <div
                className={styles.imageUpload}
                onDrop={(e) => handleDrop(e, "before")}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => handleClick("before")}
              >
                {beforeImage ? (
                  <div className={styles.imageContainer}>
                    <img
                      src={beforeImage.url}
                      alt="Before"
                      className={styles.previewImage}
                    />
                    <button
                      className={styles.removeImageButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage("before");
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <p>Öncesi için Sürükle & Bırak veya Tıkla</p>
                )}
              </div>
              <div
                className={styles.imageUpload}
                onDrop={(e) => handleDrop(e, "after")}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => handleClick("after")}
              >
                {afterImage ? (
                  <div className={styles.imageContainer}>
                    <img
                      src={afterImage.url}
                      alt="After"
                      className={styles.previewImage}
                    />
                    <button
                      className={styles.removeImageButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage("after");
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <p>Sonrası için Sürükle & Bırak veya Tıkla</p>
                )}
              </div>
            </div>

            <input
              type="text"
              placeholder="Proje Başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
            <textarea
              placeholder="Proje Detayları"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className={styles.textarea}
            />

            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeModal}>
                İptal
              </button>
              <button
                className={styles.confirmButton}
                onClick={
                  modalType === "add" ? handleAddProject : handleEditProject
                }
              >
                {modalType === "add" ? "Proje Ekle" : "Değişiklikleri Kaydet"}
              </button>
            </div>

            {errorMessage && (
              <p className="text-red-600 pt-3">{errorMessage}</p>
            )}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Önceki
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
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
  );
};

export default ManageProjects;
