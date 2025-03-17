/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useState } from "react";
import styles from "@/src/styles/admin/Login.module.scss";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import type { RequestResult } from "../@types/database";
import {
  emailVerification,
  passwordVerification,
} from "../lib/helpers/verifications";
import { getAPIPath } from "../lib/helpers/api";
import type { ForgetPasswordProps } from "../@types/components";

export default function ForgetPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<ForgetPasswordProps>({});
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isOnVerification, setIsOnVerification] = useState<boolean>(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isDisabled, setButtonDisabled] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setButtonDisabled(true);

    const newErrors: ForgetPasswordProps = {};

    if (!isOnVerification) {
      if (!email) {
        newErrors.email = "Email boş bırakılamaz";
      } else if (!emailVerification(email)) {
        newErrors.email = "Geçerli bir e-posta adresi giriniz.";
      }

      if (!username) newErrors.username = "Kullanıcı adı boş bırakılamaz";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setButtonDisabled(false);
        return;
      }
    } else {
      if (!code) newErrors.code = "Kod boş bırakılamaz";

      if (!newPassword) newErrors.newPassword = "Şifre boş bırakılamaz";

      if (!passwordVerification(newPassword)) {
        newErrors.newPassword = "Şifre en az 6 karakter uzunluğunda olmalıdır.";
      }

      if (newPassword !== confirmPassword) {
        newErrors.newPassword = "Şifreler eşleşmiyor";
        newErrors.confirmNewPassword = "Şifreler eşleşmiyor";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setButtonDisabled(false);
        return;
      }
    }

    try {
      const response = await fetch(getAPIPath("verification"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isOnVerification
            ? { username, email, code, newPassword }
            : { username, email }
        ),
      });

      const data: RequestResult = await response.json();

      if (!data.status) {
        if (data.message === "Email gönderme işlemi zaten yapıldı") {
          setButtonDisabled(false);
          setErrors({});
          return setIsOnVerification(true);
        }

        setErrors({ other: data.message });
        return setButtonDisabled(false);
      }

      if (isOnVerification) {
        setErrors({});
        setLoginMessage("Kod doğru");
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        });
        return;
      }

      setLoginMessage(
        "Kod gönderildi, doğrulama için emailinizi kontrol edin."
      );
      setButtonDisabled(false);
      setIsOnVerification(true);
    } catch {
      alert("An unexpected error occurred.");
      setButtonDisabled(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <Image
            src="/main-logo.webp"
            alt="Afra Lighting Logo"
            width={200}
            height={100}
          />
        </div>
        <h2>Şifremi Unuttum</h2>
        <FontAwesomeIcon icon={faLock} className={styles.securityIcon} />
        {!isOnVerification ? (
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className={styles.error}>{errors.username}</p>
            )}

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}

            <button disabled={isDisabled} type="submit">
              Doğrulama Kodu Gönder
            </button>
            {errors.other && <p className={styles.error}>{errors.other}</p>}
          </form>
        ) : (
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.newPassword && (
              <p className={styles.error}>{errors.newPassword}</p>
            )}

            <input
              type="password"
              placeholder="Şifreyi yeniden girin"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmNewPassword && (
              <p className={styles.error}>{errors.confirmNewPassword}</p>
            )}

            <input
              type="text"
              placeholder="Kod"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {errors.code && <p className={styles.error}>{errors.code}</p>}

            {loginMessage && (
              <p className={isSuccess ? styles.success : styles.error}>
                {loginMessage}
              </p>
            )}

            <button disabled={isDisabled} type="submit">
              Kodu Doğrula
            </button>
            {errors.other && <p className={styles.error}>{errors.other}</p>}
          </form>
        )}

        <div className={styles.developerCredit}>
          <span>Powered by</span>
          <a
            href="https://flareye.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/flareye/flareye-tm-sites.png" alt="Flareye Logo" />
          </a>
        </div>
      </div>
    </div>
  );
}
