/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../styles/components/Footer.module.scss";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUploadData } from "./utils/UploadData";
import { getKeyConditionally } from "../lib/helpers/objects";
import { seoTextReplacer } from "../lib/helpers/seo";
import Link from "next/link";

const Footer: React.FC = () => {
  const { texts = {}, seo } = useUploadData();
  const {
    logo: { path, alt },
    pages: { privacy, terms },
    poweredBy,
  } = seo!.component.footer;

  const ORGANIZATION_NAME = getKeyConditionally(texts, "name", "");
  const ADDRESS = getKeyConditionally(texts.contact, "address", "");
  const PHONE_NUMBER = getKeyConditionally(texts.contact, "phone", "");
  const EMAIL = getKeyConditionally(texts.contact, "email", "");

  const CURRENT_YEAR = new Date().getFullYear();
  const LOGO_SRC = path;
  const LOGO_ALT = seoTextReplacer(alt, {
    name: ORGANIZATION_NAME,
  });
  const PRIVACY_PAGE = privacy;
  const TERMS_PAGE = terms;
  const POWERED_BY = poweredBy;

  const SOCIAL_LINKS = {
    whatsapp: getKeyConditionally(texts.social, "whatsapp", ""),
    instagram: getKeyConditionally(texts.social, "instagram", ""),
    twitter: getKeyConditionally(texts.social, "twitter", ""),
    facebook: getKeyConditionally(texts.social, "facebook", ""),
  };

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={styles.logoSection}>
          <Link href="/">
            <img src={LOGO_SRC} alt={LOGO_ALT} />
          </Link>
          <address>
            {ADDRESS.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
            {PHONE_NUMBER}
            <br />
            {EMAIL}
          </address>
        </div>
        <div className={styles.socialIcons}>
          <a href={SOCIAL_LINKS.whatsapp}>
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
          <a href={SOCIAL_LINKS.instagram}>
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href={SOCIAL_LINKS.twitter}>
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href={SOCIAL_LINKS.facebook}>
            <FontAwesomeIcon icon={faFacebook} />
          </a>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © {CURRENT_YEAR} {ORGANIZATION_NAME}. Tüm Hakları Saklıdır.
        </p>
        <div className={styles.developerCredit}>
          <span>Powered by</span>
          <Link href={POWERED_BY.url} target="_blank" rel="noopener noreferrer">
            <img src={POWERED_BY.logo.path} alt={POWERED_BY.logo.alt} />
          </Link>
        </div>
        <ul className={styles.bottomLinks}>
          <li>
            <a href={PRIVACY_PAGE}>Gizlilik ve Çerezler</a>
          </li>
          <li>
            <a href={TERMS_PAGE}>Şartlar ve Koşullar</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
