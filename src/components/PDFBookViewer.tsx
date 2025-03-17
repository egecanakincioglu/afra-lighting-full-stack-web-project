import * as React from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import styles from "../styles/components/PDFBookViewer.module.scss";
import { PDFDocumentProxy } from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";
import LoadingElement from "./LoadingElement";
import type { PDFBookProps } from "../@types/components";

const DEFAULT_WORKER_SRC = "/pdf.worker.min.js";
const VIEWPORT_SCALE = 1;

const addition = 12;
const reloadThreshold = 6;

type PageData = [number, string];

const PDFBookViewer: React.FC<PDFBookProps> = ({ pdfUrl }) => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [firstPage, setFirstPage] = useState<string>();
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const currentPage = useRef<number>(1);
  const pageLoading = useRef<boolean>(false);

  const addPages = async (
    pageEnd: number,
    firstLoad = false
  ): Promise<void> => {
    if (!pdfRef.current) return;

    pageLoading.current = true;

    const newPages: PageData[] = [];
    const totalPageCount = pdfRef.current.numPages;
    const finishPage = Math.min(pageEnd, totalPageCount);
    const lastRegisteredPage = +(pages.at(-1)?.at(0) ?? 0);

    if (lastRegisteredPage >= finishPage) {
      pageLoading.current = false;
      return;
    }

    for (
      let currentPageNum = lastRegisteredPage + 1;
      currentPageNum <= finishPage;
      currentPageNum++
    ) {
      if (
        [...pages, ...newPages].some(([pageNum]) => pageNum === currentPageNum)
      )
        continue;

      const page = await pdfRef.current.getPage(currentPageNum);
      const viewport = page.getViewport({ scale: VIEWPORT_SCALE });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) continue;

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
      const pageDataUrl = canvas.toDataURL();

      newPages.push([currentPageNum, pageDataUrl]);

      if (firstLoad && currentPageNum === 1) {
        setFirstPage(pageDataUrl);
      }
    }

    pageLoading.current = false;
    if (firstLoad) {
      setPages(newPages);
    } else {
      setPages((prevPages) => [...prevPages, ...newPages]);
    }
  };

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);

      // @ts-expect-error bad import path
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc = DEFAULT_WORKER_SRC;
      const { getDocument } = await import("pdfjs-dist");

      const pdf = await getDocument(pdfUrl).promise;
      pdfRef.current = pdf;

      await addPages(addition, true);
      setLoading(false);
    };

    fetchPdf();
  }, [pdfUrl]);

  const width = 320;

  if (loading) {
    if (firstPage) {
      return (
        <div
          key={`${pdfUrl}.1`}
          className={`${styles.pageContainer} self-center overflow-hidden w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 relative aspect-[1/1.414]`}
        >
          <Image
            fill
            src={firstPage}
            alt="Page 1"
            className="object-contain shadow-md rounded-lg animate-pulse"
          />
        </div>
      );
    }
    return <LoadingElement />;
  }

  return (
    // @ts-expect-error wrong types
    <HTMLFlipBook
      width={width}
      height={width * 1.414}
      minWidth={width}
      size="stretch"
      className={styles.generalSection}
      autoSize={true}
      mobileScrollSupport={true}
      onFlip={async (event) => {
        const pageIndex = event.data as number;
        currentPage.current = pageIndex + 1;

        if (
          currentPage.current + reloadThreshold < pages.length ||
          pageLoading.current
        )
          return;

        await addPages(currentPage.current + addition + reloadThreshold);
      }}
    >
      {pages.map(([pageNum, pageDataUrl]) => (
        <div key={`${pdfUrl}.${pageNum}`} className={styles.pageContainer}>
          <Image fill={true} src={pageDataUrl} alt={`Page ${pageNum}`} />
        </div>
      ))}
    </HTMLFlipBook>
  );
};

export default PDFBookViewer;
