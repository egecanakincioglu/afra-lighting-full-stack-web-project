import React, { useState } from "react";
import styles from "@/src/styles/admin/AdminSettings/UpdateUser.module.scss";
import { omit, omitIfNullish } from "@/src/lib/helpers/objects";
import { passwordVerification } from "@/src/lib/helpers/verifications";
import { getAPIPath } from "@/src/lib/helpers/api";
import { useMessageState } from "@/src/lib/helpers/hooks";
import type {
  UpdateUserPassword,
  UpdateUserPasswordErrors,
} from "@/src/@types/components";

const UpdateUser: React.FC = () => {
  const [userData, setUserData] = useState<UpdateUserPassword>({});

  const {
    setErrorMessage,
    setSuccessMessage,
    clearMessages,
    successMessage,
    errorMessage,
  } = useMessageState({
    defaultErrorValue: {} as UpdateUserPasswordErrors,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: _name, value } = e.target;
    const name = _name as keyof UpdateUserPassword;

    setUserData(omitIfNullish(userData, name, value));
    setErrorMessage(omit(errorMessage, [name]));
  };

  const validateForm = () => {
    const newErrors: UpdateUserPasswordErrors = {};

    if (!userData.currentPassword) {
      newErrors.currentPassword = "Şifre gereklidir.";
    }

    if (userData.newPassword) {
      if (!passwordVerification(userData.newPassword)) {
        newErrors.newPassword = "Şifre en az 6 karakter olmalıdır.";
      } else if (userData.newPassword !== userData.confirmPassword) {
        newErrors.newPassword = "Girdiğiniz şifreler aynı değil.";
        newErrors.confirmPassword = "Girdiğiniz şifreler aynı değil.";
      }
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    clearMessages();
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setErrorMessage(errors);
      return;
    }

    try {
      const result = await fetch(getAPIPath("update-user"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword,
        }),
      });

      if (!result.ok) {
        const data = await result.json();
        setErrorMessage({ other: data.message });
        return;
      }

      setSuccessMessage("Şifreniz başarıyla güncellendi.");
    } catch {
      setErrorMessage({ other: "Beklenmeyen bir hata oluştu." });
    }
  };

  return (
    <div className={styles.userContainer}>
      <div className={styles.innerBox}>
        <h1>Kullanıcı Şifresini Güncelle</h1>

        <form className={styles.userForm}>
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

          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">Yeni Şifre</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Yeni Şifre"
              value={userData.newPassword}
              onChange={handleInputChange}
            />
            {errorMessage.newPassword && (
              <span className={styles.errorText}>
                {errorMessage.newPassword}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Yeni Şifreyi Doğrula</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Yeni Şifreyi Doğrula"
              value={userData.confirmPassword}
              onChange={handleInputChange}
            />
            {errorMessage.confirmPassword && (
              <span className={styles.errorText}>
                {errorMessage.confirmPassword}
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
