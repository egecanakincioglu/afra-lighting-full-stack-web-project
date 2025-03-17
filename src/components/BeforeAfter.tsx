import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/components/BeforeAfter.module.scss";
import titleStyles from "../styles/components/Title.module.scss";
import { useUploadData } from "./utils/UploadData";
import { projectsConverter } from "../lib/helpers/converters";
import type { Project } from "../@types/components";
import { getUploadAPIFilePath } from "../lib/helpers/api";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronsUp,
  FiChevronsDown,
  FiMove,
} from "react-icons/fi";

const ProductsTitle: React.FC = () => {
  return (
    <div className={titleStyles.headingContainer}>
      <span className={titleStyles.backgroundText}>Projelerimiz</span>
      <h1 className={titleStyles.foregroundText}>Projelerimiz</h1>
    </div>
  );
};

const BeforeAfterSlider: React.FC<Project> = ({
  beforeImage,
  afterImage,
  index,
  title,
  details,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isVertical, setIsVertical] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const touchId = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsVertical(isMobile);
      if (isMobile) setSliderPosition(50);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculatePosition = (clientPos: number, rect: DOMRect) => {
    const rawPos = isVertical
      ? ((clientPos - rect.top) / rect.height) * 100
      : ((clientPos - rect.left) / rect.width) * 100;

    return Math.max(5, Math.min(95, rawPos));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!touchId.current && e.touches[0]) {
      touchId.current = e.touches[0].identifier;
      const rect = sliderRef.current?.getBoundingClientRect();
      if (rect) {
        const clientPos = isVertical
          ? e.touches[0].clientY
          : e.touches[0].clientX;
        const position = calculatePosition(clientPos, rect);
        setSliderPosition(position);
      }
      handleMoveStart();
    }
  };

  const handleMoveStart = () => {
    isDragging.current = true;
    document.body.style.userSelect = "none";
    document.documentElement.style.cursor = isVertical
      ? "row-resize"
      : "col-resize";
  };

  const handleMoving = (clientPos: number) => {
    if (!sliderRef.current || !isDragging.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const position = calculatePosition(clientPos, rect);
    setSliderPosition(position);
  };

  const handleMoveEnd = () => {
    isDragging.current = false;
    touchId.current = null;
    document.body.style.userSelect = "";
    document.documentElement.style.cursor = "";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      handleMoving(isVertical ? e.clientY : e.clientX);

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchId.current) return;
      const touch = Array.from(e.touches).find(
        (t) => t.identifier === touchId.current
      );
      if (touch) handleMoving(isVertical ? touch.clientY : touch.clientX);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", handleMoveEnd);
    document.addEventListener("touchend", handleMoveEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMoveEnd);
      document.removeEventListener("touchend", handleMoveEnd);
    };
  }, [isVertical]);

  const clipPath = {
    before: isVertical
      ? `inset(0 0 calc(100% - ${sliderPosition}%) 0`
      : `inset(0 calc(100% - ${sliderPosition}%) 0 0)`,
    after: isVertical
      ? `inset(calc(${sliderPosition}%) 0 0 0`
      : `inset(0 0 0 calc(${sliderPosition}%))`,
  };

  return (
    <div className={styles.sliderWrapper}>
      <h3 className={styles.projectTitle}>{title}</h3>

      <div
        className={`${styles.slider} ${isVertical ? styles.vertical : ""}`}
        ref={sliderRef}
      >
        <div className={styles.labels}>
          <span className={isVertical ? styles.labelTop : styles.labelBefore}>
            {isVertical ? <FiChevronsUp /> : <FiChevronsLeft />}
            Öncesi
          </span>
          <span className={isVertical ? styles.labelBottom : styles.labelAfter}>
            {isVertical ? <FiChevronsDown /> : <FiChevronsRight />}
            Sonrası
          </span>
        </div>

        <div
          className={styles.beforeImage}
          style={{
            clipPath: clipPath.before,
            transition: isDragging.current
              ? "none"
              : "clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <img
            src={getUploadAPIFilePath(beforeImage.id)}
            alt={`Proje ${index + 1} Öncesi`}
            draggable="false"
          />
        </div>

        <div
          className={styles.afterImage}
          style={{
            clipPath: clipPath.after,
            transition: isDragging.current
              ? "none"
              : "clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <img
            src={getUploadAPIFilePath(afterImage.id)}
            alt={`Proje ${index + 1} Sonrası`}
            draggable="false"
          />
        </div>

        <div
          className={`${styles.handle} ${
            isVertical ? styles.verticalHandle : styles.horizontalHandle
          }`}
          style={
            isVertical
              ? {
                  top: `${sliderPosition}%`,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }
              : { left: `${sliderPosition}%` }
          }
          onMouseDown={handleMoveStart}
          onTouchStart={handleTouchStart}
        >
          <div className={styles.handleCircle}>
            <FiMove className={styles.handleIcon} />
          </div>
        </div>
      </div>

      <div className={styles.projectDetails}>
        <h2>Proje Detayları</h2>
        <p>{details}</p>
      </div>
    </div>
  );
};

const BeforeAfterPage: React.FC = () => {
  const { files: { projects = [] } = {} } = useUploadData();
  const [currentPage, setCurrentPage] = useState(1);
  const SLIDERS_PER_PAGE = 4;

  const sliders = projectsConverter(projects);
  const totalPages = Math.ceil(sliders.length / SLIDERS_PER_PAGE);
  const currentSliders = sliders.slice(
    (currentPage - 1) * SLIDERS_PER_PAGE,
    currentPage * SLIDERS_PER_PAGE
  );

  return (
    <div className={styles.container}>
      <ProductsTitle />
      <p className={styles.description}>
        {currentSliders.length ? (
          <>
            <span className={styles.instruction}>
              ←→ Kaydırma çubuğunu sürükleyerek karşılaştırma yapın
            </span>
            Profesyonel çözümlerimizin etkisini görsel olarak keşfedin
          </>
        ) : (
          "Henüz yüklenmiş proje bulunmamaktadır"
        )}
      </p>

      {currentSliders.map((slider, index) => (
        <BeforeAfterSlider
          key={slider.beforeImage.id}
          {...slider}
          index={index}
        />
      ))}

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

export default BeforeAfterPage;
