import React, { useState } from "react";
import styles from "@/src/styles/admin/CorporateSettings/UpdateName.module.scss";
import type { RequestResult } from "@/src/@types/database";
import { getAPIPath, getUploadsTexts } from "@/src/lib/helpers/api";
import { useUploadData } from "../../utils/UploadData";
import { useMessageState } from "@/src/lib/helpers/hooks";

const UpdateName: React.FC = () => {
  const { texts } = useUploadData();

  const [APICompanyName, setAPICompanyName] = useState(
    (texts?.name as string | undefined) ?? ""
  );
  const [companyName, setCompanyName] = useState(APICompanyName);
  const [loadCompleted, setLoadCompleted] = useState<boolean>(false);

  const { setErrorMessage, setSuccessMessage, successMessage, errorMessage } =
    useMessageState();

  const resetName = async () => {
    try {
      const firstLoad = loadCompleted === false;
      setLoadCompleted(false);

      if (!firstLoad) {
        const name = (await getUploadsTexts()).name as string;

        setAPICompanyName(name);
        setCompanyName(name);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadCompleted(true);
    }
  };

  const handleUpdate = async () => {
    const name = companyName.trim();

    if (!name || APICompanyName === name) {
      return setErrorMessage("Şirket ismi boş veya öncekiyle aynı olamaz.");
    }

    try {
      const res = await fetch(getAPIPath("uploads/texts"), {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data: RequestResult = await res.json();
        return setErrorMessage(
          data.message || "Güncelleme sırasında hata oluştu"
        );
      }

      setSuccessMessage("Şirket ismi başarıyla güncellendi.");
      resetName();
    } catch {
      setErrorMessage("İsim değiştirme sırasında bir hata oluştu");
    }
  };

  return (
    <div className={styles.updateNameContainer}>
      <div className={styles.innerBox}>
        <h1>Şirket İsmi Güncelle</h1>
        <p>Lütfen şirket ismini giriniz:</p>
        <input
          type="text"
          placeholder="Yeni Şirket İsmi"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        {errorMessage && (
          <span className={styles.errorText}>{errorMessage}</span>
        )}
        {successMessage && (
          <span className={styles.successText}>{successMessage}</span>
        )}
        <button onClick={handleUpdate} className={styles.updateButton}>
          Güncelle
        </button>
      </div>
    </div>
  );
};

export default UpdateName;
