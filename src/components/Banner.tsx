/* eslint-disable @next/next/no-img-element */
import globalStyles from "../styles/Globals.module.scss";
import React from "react";
import styles from "../styles/components/Banner.module.scss";
import { useUploadData } from "./utils/UploadData";
import { seoTextReplacer } from "../lib/helpers/seo";
import { getKeyConditionally } from "../lib/helpers/objects";
import { getUploadAPIFilePath } from "../lib/helpers/api";

const Banner: React.FC = () => {
  const { texts = {}, seo, files = {} } = useUploadData();
  const {
    images: { alt: altTemplate },
  } = seo!.component.banner;

  const ORGANIZATION_NAME = getKeyConditionally(texts, "name", "");

  const bannerFile = files.banner?.at(0);
  const banner = {
    src: bannerFile ? getUploadAPIFilePath(bannerFile.id) : "",
    alt: seoTextReplacer(altTemplate, {
      name: ORGANIZATION_NAME,
    }),
  };

  return (
    <div
      className={`${styles.bannerContainer} flex w-full flex-col md:flex-row`}
    >
      <div className={`${styles.sideRectangle} ${globalStyles.generalRounded}`}>
        <img src={banner.src} alt={banner.alt} />
      </div>
    </div>
  );
};

export default Banner;
