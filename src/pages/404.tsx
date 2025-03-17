import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/pages/404.module.scss";

const Custom404 = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1>404</h1>
        <p>Aradığınız sayfa bulunamadı</p>
        <button onClick={() => router.push("/")}>Ana Sayfaya Dön</button>
      </div>
    </div>
  );
};

export default Custom404;
