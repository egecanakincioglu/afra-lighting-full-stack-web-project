import React, { useState } from "react";
import styles from "@/src/styles/admin/AdminSettings/UpdateUser.module.scss";
import { omit, omitIfNullish } from "@/src/lib/helpers/objects";
import { emailVerification } from "@/src/lib/helpers/verifications";
import { getAPIPath } from "@/src/lib/helpers/api";
import { useMessageState } from "@/src/lib/helpers/hooks";
import type {
  UpdateUserEmail,
  UpdateUserEmailErrors,
} from "@/src/@types/components";

const UpdateUser: React.FC = () => {
  const [userData, setUserData] = useState<UpdateUserEmail>({});

  const {
    setErrorMessage,
    setSuccessMessage,
    clearMessages,
    errorMessage,
    successMessage,
  } = useMessageState({
    defaultErrorValue: {} as UpdateUserEmailErrors,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: _name, value } = e.target;
    const name = _name as keyof UpdateUserEmail;

    setUserData(omitIfNullish(userData, name, value));
    setErrorMessage(omit(errorMessage, [name]));
  };

  const validateForm = () => {
    const newErrors: UpdateUserEmailErrors = {};

    if (!userData.currentPassword) {
      newErrors.currentPassword = "Şifre gereklidir.";
    }

    if (!emailVerification(userData.currentEmail)) {
      newErrors.currentEmail = "Güncel e-posta adresi geçersiz.";
    } else if (!emailVerification(userData.newEmail)) {
      newErrors.newEmail = "Yeni e-posta adresi geçersiz.";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    clearMessages();
    const errors = validateForm();

    if (Object.keys(errors).length) {
      return setErrorMessage(errors);
    }

    try {
      const result = await fetch(getAPIPath("update-user"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: userData.currentPassword,
          currentEmail: userData.currentEmail,
          newEmail: userData.newEmail,
        }),
      });

      if (!result.ok) {
        const data = await result.json();
        setErrorMessage({ other: data.message });
        return;
      }

      setSuccessMessage("Email adresiniz başarıyla güncellendi.");
    } catch {
      setErrorMessage({ other: "Beklenmeyen bir hata oluştu." });
    }
  };

  return (
    <div className={styles.userContainer}>
      <div className={styles.innerBox}>
        <h1>Kullanıcı Emailini Güncelle</h1>

        <form className={styles.userForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="currentEmail">Güncel E-Posta Adresi</label>
            <input
              type="text"
              name="currentEmail"
              placeholder="Güncel E-Posta Adresi"
              value={userData.currentEmail}
              onChange={handleInputChange}
            />
            {errorMessage.currentEmail && (
              <span className={styles.errorText}>
                {errorMessage.currentEmail}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="newEmail">Yeni E-Posta Adresi</label>
            <input
              type="text"
              name="newEmail"
              placeholder="Yeni E-Posta Adresi"
              value={userData.newEmail}
              onChange={handleInputChange}
            />
            {errorMessage.newEmail && (
              <span className={styles.errorText}>{errorMessage.newEmail}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="currentPassword">Şifre</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Şifre"
              value={userData.currentPassword}
              onChange={handleInputChange}
            />
            {errorMessage.currentPassword && (
              <span className={styles.errorText}>
                {errorMessage.currentPassword}
              </span>
            )}
          </div>
        </form>

        <div className="flex flex-col mt-6">
          <button
            type="button"
            className={`${styles.updateButton} self-center`}
            onClick={handleSubmit}
          >
            Güncelle
          </button>

          {successMessage && (
            <span className={styles.successText}>{successMessage}</span>
          )}

          {errorMessage.other && (
            <span className={styles.errorText}>{errorMessage.other}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
