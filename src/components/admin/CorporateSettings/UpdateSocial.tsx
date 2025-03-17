import React, { useState } from "react";
import styles from "@/src/styles/admin/CorporateSettings/UpdateSocial.module.scss";
import type { RequestResult } from "@/src/@types/database";
import {
  facebookSiteVerification,
  instagramSiteVerification,
  whatsappSiteVerification,
  twitterSiteVerification,
} from "@/src/lib/helpers/verifications";
import type { Social, SocialErrors } from "@/src/@types/components";
import { omit } from "@/src/lib/helpers/objects";
import { getAPIPath, getUploadsTexts } from "@/src/lib/helpers/api";
import { useUploadData } from "../../utils/UploadData";
import { useMessageState } from "@/src/lib/helpers/hooks";

const UpdateSocial: React.FC = () => {
  const { texts } = useUploadData();

  const [APISocialLinks, setAPISocialLinks] = useState(
    (texts?.social as Social | undefined) ?? {}
  );
  const [socialLinks, setSocialLinks] = useState<Social>(APISocialLinks);
  const [loadCompleted, setLoadCompleted] = useState<boolean>(false);

  const { setErrorMessage, setSuccessMessage, successMessage, errorMessage } =
    useMessageState({
      defaultErrorValue: {} as SocialErrors,
    });

  const resetSocial = async () => {
    try {
      const firstLoad = loadCompleted === false;
      setLoadCompleted(false);

      if (!firstLoad) {
        const social = (await getUploadsTexts()).social as Social;

        setAPISocialLinks(social);
        setSocialLinks(social);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadCompleted(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: _name, value } = e.target;
    const name = _name as keyof Social;

    setSocialLinks(
      value === ""
        ? omit(socialLinks, [name])
        : { ...socialLinks, [name]: value }
    );
    setErrorMessage(omit(errorMessage, [name as keyof SocialErrors]));
  };

  const validateForm = () => {
    const newErrors: SocialErrors = {};

    const urlPatterns = {
      whatsapp: whatsappSiteVerification,
      instagram: instagramSiteVerification,
      twitter: twitterSiteVerification,
      facebook: facebookSiteVerification,
    };

    if (!Object.entries(socialLinks).length) {
      return setErrorMessage({ others: "En az bir alanı doldurunuz." });
    }

    Object.entries(urlPatterns).forEach(([key, verifier]) => {
      if (!(key in socialLinks)) return;

      const value = socialLinks[key as keyof typeof socialLinks]!;

      if (!verifier(value)) {
        newErrors[key as keyof typeof newErrors] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } için geçerli bir URL giriniz.`;
      }
    });

    setErrorMessage(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newErrors: SocialErrors = {};

    try {
      const res = await fetch(getAPIPath("uploads/texts"), {
        method: "POST",
        body: JSON.stringify({ social: socialLinks }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data: RequestResult = await res.json();
        newErrors.others =
          data.message ||
          "Sosyal medya hesaplarını güncellerken bir hata oluştu";
        return setErrorMessage(newErrors);
      }

      setSuccessMessage("Sosyal medya hesapları başarıyla güncellendi.");
      resetSocial();
    } catch {
      newErrors.others =
        "Sosyal medya hesaplarını güncellerken bir hata oluştu";
      setErrorMessage(newErrors);
    }
  };

  return (
    <div className={styles.socialContainer}>
      <div className={styles.innerBox}>
        <h1>Sosyal Medya Hesaplarını Güncelle</h1>
        <p className={styles.infoText}>
          Lütfen yalnızca platforma özgü geçerli URL formatında bağlantılar
          giriniz. Örneğin:
          <span>https://wa.me/90551XXXXXXX</span>
        </p>
        <form className={styles.socialForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              placeholder="WhatsApp Profil Bağlantısı"
              value={socialLinks.whatsapp}
              onChange={handleInputChange}
            />
            {errorMessage.whatsapp && (
              <span className={styles.errorText}>{errorMessage.whatsapp}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="instagram">Instagram</label>
            <input
              type="text"
              name="instagram"
              placeholder="Instagram Profil Bağlantısı"
              value={socialLinks.instagram}
              onChange={handleInputChange}
            />
            {errorMessage.instagram && (
              <span className={styles.errorText}>{errorMessage.instagram}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="twitter">X (Twitter)</label>
            <input
              type="text"
              name="twitter"
              placeholder="X (Twitter) Profil Bağlantısı"
              value={socialLinks.twitter}
              onChange={handleInputChange}
            />
            {errorMessage.twitter && (
              <span className={styles.errorText}>{errorMessage.twitter}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="facebook">Facebook</label>
            <input
              type="text"
              name="facebook"
              placeholder="Facebook Profil Bağlantısı"
              value={socialLinks.facebook}
              onChange={handleInputChange}
            />
            {errorMessage.facebook && (
              <span className={styles.errorText}>{errorMessage.facebook}</span>
            )}
          </div>

          <button
            type="button"
            className={styles.updateButton}
            onClick={handleSubmit}
          >
            Güncelle
          </button>

          {successMessage && (
            <span className={styles.successText}>{successMessage}</span>
          )}
          {errorMessage.others && (
            <span className={styles.errorText}>{errorMessage.others}</span>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateSocial;
