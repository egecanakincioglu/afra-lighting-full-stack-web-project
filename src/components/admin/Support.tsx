/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "@/src/styles/admin/Support.module.scss";
import { useUploadData } from "../utils/UploadData";
import type { Contact } from "@/src/@types/components";

const SupportPage: React.FC = () => {
  const { texts } = useUploadData();

  const contact = (texts?.contact ?? {}) as Contact;

  const phone = contact.phone ?? "";
  const email = contact.email ?? "";

  return (
    <div className={styles.supportPageContainer}>
      <div className={styles.outerBox}>
        <img
          src="/flareye/flareye-tm-sites.png"
          alt="Flareye Şirket Logosu"
          className={styles.logo}
        />
        <h1>Destek Merkezi</h1>
        <p className={styles.infoText}>
          İhtiyacınız olan desteği almak için aşağıdaki seçeneklerden birini
          kullanabilirsiniz.
        </p>
        <div className={styles.supportOptions}>
          <a href={`mailto:${email}`} className={styles.supportCard}>
            <h3>Email ile Destek</h3>
            <p>Bizimle e-posta yoluyla iletişime geçmek için tıklayın.</p>
          </a>
          <a href={`tel:${phone}`} className={styles.supportCard}>
            <h3>Telefon ile Destek</h3>
            <p>Çağrı merkezimizi arayarak destek alın.</p>
          </a>
          <a href="/support/tickets" className={styles.supportCard}>
            <h3>Destek Talebi Oluştur</h3>
            <p>Web sitemizin destek sayfasını ziyaret edin.</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
