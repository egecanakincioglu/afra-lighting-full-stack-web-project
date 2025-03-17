import React, { useState } from "react";
import styles from "@/src/styles/admin/CorporateSettings/UpdateContact.module.scss";
import type { RequestResult } from "@/src/@types/database";
import {
  emailVerification,
  phoneVerification,
} from "@/src/lib/helpers/verifications";
import type { Contact, ContactErrors } from "@/src/@types/components";
import { omit } from "@/src/lib/helpers/objects";
import { getAPIPath, getUploadsTexts } from "@/src/lib/helpers/api";
import { useUploadData } from "../../utils/UploadData";
import { useMessageState } from "@/src/lib/helpers/hooks";

const UpdateContact: React.FC = () => {
  const { texts } = useUploadData();

  const [APIContactInfo, setAPIContactInfo] = useState(
    (texts?.contact as Contact | undefined) ?? {}
  );
  const [contactInfo, setContactInfo] = useState(APIContactInfo);
  const [loadCompleted, setLoadCompleted] = useState<boolean>(false);

  const { setErrorMessage, setSuccessMessage, errorMessage, successMessage } =
    useMessageState({
      defaultErrorValue: {} as ContactErrors,
    });

  const resetContact = async () => {
    try {
      const firstLoad = loadCompleted === false;
      setLoadCompleted(false);

      if (!firstLoad) {
        const contact = (await getUploadsTexts()).contact as Contact;

        setAPIContactInfo(contact);
        setContactInfo(contact);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadCompleted(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name: _name, value } = e.target;
    const name = _name as keyof Contact;

    setContactInfo(
      value === ""
        ? omit(contactInfo, [name])
        : { ...contactInfo, [name]: value }
    );
    setErrorMessage(omit(errorMessage, [name]));
  };

  const validateForm = () => {
    const newErrors: ContactErrors = {};

    if (!Object.keys(contactInfo).length)
      newErrors.others = "En az bir alanı doldurunuz.";

    if (contactInfo.phone && !phoneVerification(contactInfo.phone))
      newErrors.phone = "Geçerli bir telefon numarası giriniz.";

    if (contactInfo.email && !emailVerification(contactInfo.email))
      newErrors.email = "Geçerli bir e-posta adresi giriniz.";

    setErrorMessage(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newErrors: ContactErrors = {};

    try {
      const res = await fetch(getAPIPath("uploads/texts"), {
        method: "POST",
        body: JSON.stringify({ contact: contactInfo }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data: RequestResult = await res.json();
        newErrors.others =
          data.message || "İletişim bilgilerini güncellerken bir hata oluştu";
        return setErrorMessage(newErrors);
      }

      setSuccessMessage("İletişim bilgileri başarıyla güncellendi.");
    } catch {
      newErrors.others = "İletişim bilgilerini güncellerken bir hata oluştu";
      setErrorMessage(newErrors);
      return;
    }

    setSuccessMessage("İletişim bilgileri başarıyla güncellendi.");
    resetContact();
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.innerBox}>
        <div className={styles.headerContainer}>
          <h1>İletişim Bilgilerini Güncelle</h1>
        </div>
        <form className={styles.contactForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Telefon Numarası</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Telefon Numarası"
              value={contactInfo.phone}
              onChange={handleInputChange}
            />
            {errorMessage.phone && (
              <span className={styles.errorText}>{errorMessage.phone}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-posta Adresi</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-posta Adresi"
              value={contactInfo.email}
              onChange={handleInputChange}
            />
            {errorMessage.email && (
              <span className={styles.errorText}>{errorMessage.email}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="address">Şirket Adresi</label>
            <textarea
              id="address"
              name="address"
              placeholder="Şirket Adresi"
              value={contactInfo.address}
              onChange={handleInputChange}
            />
            {errorMessage.address && (
              <span className={styles.errorText}>{errorMessage.address}</span>
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

export default UpdateContact;
