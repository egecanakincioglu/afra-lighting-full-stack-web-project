/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../styles/components/Highlights.module.scss";
import { useUploadData } from "./utils/UploadData";
import {
  createArray,
  getKeyConditionally,
  getNormalFile,
} from "../lib/helpers/objects";
import { seoTextReplacer } from "../lib/helpers/seo";
import Link from "next/link";
import { getUploadAPIFilePath } from "../lib/helpers/api";
import { uploadsCategoryConfig } from "../lib/config/files";
import { useRouter } from "next/router";
import type { UploadsFile } from "../@types/database";

const Highlights: React.FC = () => {
  const { files = {}, seo, texts } = useUploadData();
  const router = useRouter();

  const { favorites, ads, catalog = [] } = files;
  const highlightCount = uploadsCategoryConfig.favorites?.maxCount ?? 0;
  const adCount = uploadsCategoryConfig.ads?.maxCount ?? 0;

  const getCatalogItem = (index: number) => {
    return catalog.find((item) => item.index === index);
  };

  const {
    images: { alt: altTemplate },
    ads: { alt: adAltTemplate },
  } = seo!.component.highlights;

  const ORGANIZATION_NAME = getKeyConditionally(texts, "name", "");

  const PRODUCT_HIGHLIGHTS = createArray(highlightCount, (index) => {
    const item = getNormalFile(favorites?.find((item) => item.index === index));

    return {
      id: item?.id ?? index,
      imgSrc: item ? getUploadAPIFilePath(item.id) : "",
      title: item?.metadata?.title ?? "",
      alt: seoTextReplacer(altTemplate, {
        name: ORGANIZATION_NAME,
      }),
    };
  });

  const AD_BANNERS = createArray(adCount, (index) => {
    const item = ads?.find((item) => item.index === index);

    return {
      id: item?.id ?? index,
      imgSrc: item ? getUploadAPIFilePath(item.id) : "",
      alt: seoTextReplacer(adAltTemplate, {
        name: ORGANIZATION_NAME,
      }),
    };
  });

  const clickEvent = (item: UploadsFile | undefined) => {
    return item && router.push(`/catalogs?catalogIndex=${item.index}`);
  };

  return (
    <div className={styles.highlightsContainer}>
      <div
        className={`${styles.products} grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6`}
      >
        {AD_BANNERS.map((ad, index) => {
          const catalogItem = getCatalogItem(index);

          return (
            <div
              key={ad.id}
              className={`${styles.adBanner} ${
                catalogItem ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={() => clickEvent(catalogItem)}
            >
              <img src={ad.imgSrc} alt={ad.alt} />
            </div>
          );
        })}

        {PRODUCT_HIGHLIGHTS.map((product) => (
          <div key={product.id} className={styles.product}>
            <Link href="/contact">
              <img src={product.imgSrc} alt={product.alt} />
              <p className={styles.productTitle}>{product.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlights;
