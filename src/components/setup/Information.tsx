import React from "react";
import Image from "next/image";
import styles from "@/src/styles/setup/Information.module.scss";
import Link from "next/link";

const Information: React.FC = () => {
  return (
    <div className={styles.setupInfoContainer}>
      <div className={styles.setupBox}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <Image
              src="/flareye/clearview-flareye.png"
              alt="Flareye Logo"
              width={150}
              height={50}
            />
          </div>
          <span className={styles.betaVersion}>Beta v0.1</span>
        </div>
        <h1>Kurulum Bilgilendirme</h1>
        <p>
          Bu sayfa, web sitesi kurulum sürecinde size rehberlik etmek için
          hazırlanmıştır. Adımları dikkatlice okuyun ve eksiksiz bir şekilde
          uygulayın.
        </p>
      </div>
      <div className={styles.stepsTable}>
        <h2>Kurulum Adımları</h2>
        <ol>
          <li>
            <strong>Adım 1: Lisans Sözleşmesi</strong>
            <p>
              Flareye Şirketi’nin lisans sözleşmesini kabul edin. Bu sözleşme,
              yazılımın kullanım şartlarını içerir.
            </p>
          </li>
          <li>
            <strong>Adım 2: Veritabanı Bağlantısı</strong>
            <p>
              Veritabanı bağlantısı için aşağıdaki verilerin girilmesi
              gerekmektedir:
            </p>
            <ul>
              <li>Database Host</li>
              <li>Database Username</li>
              <li>Database Password</li>
              <li>Database Name</li>
            </ul>
            <p>Bilgilerin doğruluğuna dikkat edin.</p>
          </li>
          <li>
            <strong>Adım 3: Admin Hesabı Oluşturma</strong>
            <p>
              E-posta adresinizi ve unutmayacağınız bir şifre girin. Şifre
              doğrulamasını doğru yapmaya özen gösterin.
            </p>
          </li>
          <li>
            <strong>Adım 4: İndirme ve Kurulum</strong>
            <p>
              İndirme ve kurulum işlemi tamamlandıktan sonra sistemi kullanmaya
              başlayabilirsiniz.
            </p>
          </li>
        </ol>
        <Link href="/setup/step-1">
          <button className={styles.nextStepButton}>Kuruluma Başla</button>
        </Link>
      </div>
    </div>
  );
};

export default Information;
