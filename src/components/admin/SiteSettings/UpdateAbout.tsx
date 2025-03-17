import React, { useState } from "react";
import styles from "@/src/styles/admin/SiteSettings/UpdateAbout.module.scss";
import type { RequestResult } from "@/src/@types/database";
import { getAPIPath, getUploadsTexts } from "@/src/lib/helpers/api";
import { useUploadData } from "../../utils/UploadData";
import { useMessageState } from "@/src/lib/helpers/hooks";

const UpdateAbout: React.FC = () => {
  const { texts } = useUploadData();

  const [APIAboutText, setAPIAboutText] = useState(
    (texts?.about as string | undefined) ?? ""
  );
  const [aboutText, setAboutText] = useState(APIAboutText);
  const [loadCompleted, setLoadCompleted] = useState<boolean>(false);

  const { setErrorMessage, setSuccessMessage, errorMessage, successMessage } =
    useMessageState();

  const resetAbout = async () => {
    try {
      const firstLoad = loadCompleted === false;
      setLoadCompleted(false);

      if (!firstLoad) {
        const about = (await getUploadsTexts()).about as string;

        setAPIAboutText(about);
        setAboutText(about);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadCompleted(true);
    }
  };

  const handleUpdate = async () => {
    const lastText = aboutText.trim();

    if (!lastText || APIAboutText === lastText) {
      setErrorMessage("Hakkımızda metni boş veya öncekiyle aynı olamaz.");
      return;
    }

    try {
      const res = await fetch(getAPIPath("uploads/texts"), {
        method: "POST",
        body: JSON.stringify({ about: lastText }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data: RequestResult = await res.json();
        return setErrorMessage(
          data.message || "Hakkımızdayı güncellerken bir hata oluştu"
        );
      }

      setSuccessMessage("Hakkımızda başarıyla güncellendi.");
      resetAbout();
    } catch {
      setErrorMessage("Hakkımızdayı güncellerken bir hata oluştu");
    }
  };

  return (
    <div className={styles.updateAboutContainer}>
      <div className={styles.outerBox}>
        <h1>Hakkımızdayı Güncelle</h1>
        <p className={styles.infoText}>
          Hakkımızda yazısını güncellemek için aşağıdaki metin alanını
          kullanabilirsiniz.
        </p>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        <textarea
          placeholder="Hakkımızda yazısını buraya girin..."
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          className={styles.aboutInput}
        />
        <button className={styles.updateButton} onClick={handleUpdate}>
          Güncelle
        </button>
      </div>
    </div>
  );
};

export default UpdateAbout;
