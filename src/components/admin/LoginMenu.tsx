/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useState } from "react";
import styles from "@/src/styles/admin/Login.module.scss";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Link from "next/link";
import { getAPIPath } from "@/src/lib/helpers/api";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isDisabled, setButtonDisabled] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setButtonDisabled(true);

    const newErrors: { username?: string; password?: string } = {};

    if (!username) newErrors.username = "Kullanıcı adı boş bırakılamaz";
    if (!password) newErrors.password = "Şifre boş bırakılamaz";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setButtonDisabled(false);
      return;
    }

    try {
      const response = await fetch(getAPIPath("login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setLoginMessage("Giriş başarılı!");
        setIsSuccess(true);

        setTimeout(() => {
          router.reload();
        }, 1000);
      } else {
        setLoginMessage("Kullanıcı adı veya şifre yanlış");
        setIsSuccess(false);
        setButtonDisabled(false);
      }
    } catch {
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
        <h2>Yönetim Paneline Güvenli Giriş</h2>
        <FontAwesomeIcon icon={faLock} className={styles.securityIcon} />
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          {loginMessage && (
            <p className={isSuccess ? styles.success : styles.error}>
              {loginMessage}
            </p>
          )}

          <button disabled={isDisabled} type="submit">
            Giriş Yap
          </button>
          <Link href="/forgot-password" className={styles.forgotPassword}>
            Şifremi Unuttum
          </Link>
        </form>
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
};

export default Login;
