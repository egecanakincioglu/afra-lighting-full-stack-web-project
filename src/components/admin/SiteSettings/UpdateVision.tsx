import React, { useState } from "react";
import styles from "@/src/styles/admin/SiteSettings/UpdateVision.module.scss";
import type { RequestResult } from "@/src/@types/database";
import { getAPIPath, getUploadsTexts } from "@/src/lib/helpers/api";
import { useUploadData } from "../../utils/UploadData";
import { useMessageState } from "@/src/lib/helpers/hooks";

const UpdateVision: React.FC = () => {
  const { texts } = useUploadData();

  const [APIVisionText, setAPIVisionText] = useState(
    (texts?.vision as string | undefined) ?? ""
  );
  const [visionText, setVisionText] = useState(APIVisionText);
  const [loadCompleted, setLoadCompleted] = useState<boolean>(false);

  const { setErrorMessage, setSuccessMessage, errorMessage, successMessage } =
    useMessageState();

  const resetVision = async () => {
    try {
      const firstLoad = loadCompleted === false;
      setLoadCompleted(false);

      if (!firstLoad) {
        const vision = (await getUploadsTexts()).vision as string;

        setAPIVisionText(vision);
        setVisionText(vision);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadCompleted(true);
    }
  };

  const handleUpdate = async () => {
    const lastText = visionText.trim();

    if (!lastText || APIVisionText === lastText) {
      setErrorMessage("Vizyon metni boş veya öncekiyle aynı olamaz.");
    }

    try {
      const res = await fetch(getAPIPath("uploads/texts"), {
        method: "POST",
        body: JSON.stringify({ vision: lastText }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data: RequestResult = await res.json();
        return setErrorMessage(
          data.message || "Vizyonu güncellerken bir hata oluştu"
        );
      }

      setSuccessMessage("Vizyon başarıyla güncellendi.");
      resetVision();
    } catch {
      setErrorMessage("Vizyonu güncellerken bir hata oluştu");
    }
  };

  return (
    <div className={styles.updateVisionContainer}>
      <div className={styles.outerBox}>
        <h1>Vizyon Güncelle</h1>
        <p className={styles.infoText}>
          Vizyon yazısını güncellemek için aşağıdaki metin alanını
          kullanabilirsiniz.
        </p>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        <textarea
          placeholder="Vizyon yazısını buraya girin..."
          value={visionText}
          onChange={(e) => setVisionText(e.target.value)}
          className={styles.visionInput}
        />
        <button className={styles.updateButton} onClick={handleUpdate}>
          Güncelle
        </button>
      </div>
    </div>
  );
};

export default UpdateVision;
