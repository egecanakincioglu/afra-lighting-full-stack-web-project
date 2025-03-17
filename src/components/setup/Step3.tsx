import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/src/styles/setup/Step3.module.scss";
import {
  emailVerification,
  passwordVerification,
} from "@/src/lib/helpers/verifications";
import { getAPIPath } from "@/src/lib/helpers/api";

const Step3: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    api: "",
  });
  const [showPasswordMismatchError, setShowPasswordMismatchError] =
    useState(false);
  const [buttonActive, setButtonActive] = useState(true);
  const router = useRouter();

  const isFormComplete =
    email && password && confirmPassword && password === confirmPassword;

  const handleNextStep = async () => {
    setButtonActive(false);
    const newErrors = { email: "", password: "", confirmPassword: "", api: "" };

    if (!emailVerification(email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz.";
    }

    if (!passwordVerification(password)) {
      newErrors.password = "Şifre en az 6 karakter uzunluğunda olmalıdır.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor.";
      setShowPasswordMismatchError(true);
    } else {
      setShowPasswordMismatchError(false);
    }

    if (!newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      const response = await fetch(getAPIPath("firstLogin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 3, data: { email, password } }),
      });

      if (response.ok) {
        router.push("/setup/step-4");
      } else {
        const { message }: { message: string } = await response.json();
        newErrors.api = message;
      }
    }

    setErrors(newErrors);
    setButtonActive(true);
  };

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
        <h1>Adım 3: Admin Hesabı Oluşturma</h1>
        <p>Lütfen admin hesabı için gerekli bilgileri giriniz:</p>
        <form className={styles.adminForm}>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className={styles.errorText}>{errors.password}</span>
          )}

          <input
            type="password"
            placeholder="Şifreyi Doğrula"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (password !== e.target.value) {
                setShowPasswordMismatchError(true);
              } else {
                setShowPasswordMismatchError(false);
              }
            }}
          />
          {showPasswordMismatchError && (
            <span className={styles.errorText}>Şifreler eşleşmiyor.</span>
          )}

          <button
            type="button"
            className={styles.nextStepButton}
            onClick={handleNextStep}
            disabled={!isFormComplete || !buttonActive}
          >
            Sonraki Adım
          </button>
          {errors.api && <span className={styles.errorText}>{errors.api}</span>}
        </form>
      </div>
    </div>
  );
};

export default Step3;
