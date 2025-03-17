import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/src/styles/setup/Step2.module.scss";
import styles3 from "@/src/styles/setup/Step3.module.scss";
import type { Step2Props } from "@/src/@types/components";
import { getAPIPath } from "@/src/lib/helpers/api";

async function handleNextStep({
  dbHost,
  dbUsername,
  dbPassword,
  dbName,
  setErrors,
  router,
}: Step2Props) {
  const response = await fetch(getAPIPath("firstLogin"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      step: 2,
      data: {
        host: dbHost,
        user: dbUsername,
        password: dbPassword,
        database: dbName,
      },
    }),
  });

  if (response.ok) {
    return router.push("/setup/step-3");
  }

  const { message }: { message: string } = await response.json();
  setErrors({ api: message });
}

const Step2: React.FC = () => {
  const [dbHost, setDbHost] = useState("");
  const [dbUsername, setDbUsername] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [dbName, setDbName] = useState("");
  const [errors, setErrors] = useState({ api: "" });
  const router = useRouter();

  const isFormComplete = dbHost && dbUsername && dbPassword && dbName;

  return (
    <div className={styles.stepContainer}>
      <div className={styles.innerBox}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <Image
              src="/flareye/clearview-flareye.png"
              alt="ClearView Logo"
              width={150}
              height={50}
            />
          </div>
          <span className={styles.betaVersion}>Beta v0.1</span>
        </div>
        <h1>Adım 2: Database Bağlantısı</h1>
        <p>Lütfen veritabanı bağlantısı için gerekli bilgileri giriniz:</p>
        <form className={styles.dbForm}>
          <input
            type="text"
            placeholder="Database Host"
            value={dbHost}
            onChange={(e) => setDbHost(e.target.value)}
          />
          <input
            type="text"
            placeholder="Database Username"
            value={dbUsername}
            onChange={(e) => setDbUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Database Password"
            value={dbPassword}
            onChange={(e) => setDbPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Database Name"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
          />
          <button
            type="button"
            className={styles.nextStepButton}
            onClick={() =>
              handleNextStep({
                dbHost,
                dbUsername,
                dbPassword,
                dbName,
                setErrors,
                router,
              })
            }
            disabled={!isFormComplete}
          >
            Sonraki Adım
          </button>
          {errors.api && (
            <span className={styles3.errorText}>{errors.api}</span>
          )}
        </form>
      </div>
    </div>
  );
};

export default Step2;
