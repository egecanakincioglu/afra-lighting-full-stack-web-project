import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/src/styles/setup/Step4.module.scss";
import { getAPIPath } from "@/src/lib/helpers/api";

const Step4: React.FC = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleGoToHome = () => {
    router.push("/");
  };

  useEffect(() => {
    const checkCompletion = async () => {
      await fetch(getAPIPath("firstLogin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 4, data: {} }),
      });

      // TODO: add verification and resetting when check failed
    };

    checkCompletion();
  });

  return (
    <div className={styles.stepContainer}>
      <div className={styles.innerBox}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <Image
              src="/flareye/clearview-flareye.png"
              alt="ClearView Flareye Logo"
              width={150}
              height={50}
            />
          </div>
          <span className={styles.betaVersion}>Beta v0.1</span>
        </div>
        <h1>Kurulum Tamamlandı</h1>
        <p>
          Tebrikler! Kurulum başarıyla tamamlandı. Yönetim paneline giriş yapmak
          için tarayıcınızın URL çubuğuna{" "}
          <strong>{process.env.NEXT_PUBLIC_SITE_URL}/dashboard</strong> yazın ve
          giriş yapın.
        </p>
        <div className={styles.stepsSummary}>
          <h2>Yapılan İşlemler:</h2>
          <ul>
            <li>
              <span className={styles.completed}>✔</span> Lisans sözleşmesi
              kabul edildi.
            </li>
            <li>
              <span className={styles.completed}>✔</span> Veritabanı bağlantısı
              kuruldu.
            </li>
            <li>
              <span className={styles.completed}>✔</span> Admin hesabı
              oluşturuldu.
            </li>
          </ul>
        </div>
        <div className={styles.footerText}>
          Artık tüm özellikleri kullanmaya hazırsınız. İyi çalışmalar dileriz!
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.homeButton} onClick={handleGoToHome}>
            Ana Sayfa
          </button>
          <button
            className={styles.dashboardButton}
            onClick={handleGoToDashboard}
          >
            Yönetim Paneli
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
