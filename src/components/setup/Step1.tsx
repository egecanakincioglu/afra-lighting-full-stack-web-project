import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/src/styles/setup/Step1.module.scss";
import { getAPIPath } from "@/src/lib/helpers/api";

const Step1: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const licenseRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const container = licenseRef.current;
      if (container) {
        const isScrolledToEnd =
          Math.ceil(container.scrollTop + container.clientHeight) >=
          container.scrollHeight;
        if (isScrolledToEnd) {
          setIsAccepted(true);
        }
      }
    };

    const container = licenseRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleAccept = async () => {
    await fetch(getAPIPath("firstLogin"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: 1, data: true }),
    });
    router.push("/setup/step-2");
  };

  const handleReject = () => {
    router.push("/setup");
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
        <h1>Adım 1: Lisans Sözleşmesi</h1>
        <div className={styles.licenseText} ref={licenseRef}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisi eu consectetur interdum, nisl nunc commodo ligula, id
            auctor nulla eros ut turpis. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec euismod, nisi eu consectetur interdum, nisl
            nunc commodo ligula, id auctor nulla eros ut turpis. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi eu
            consectetur interdum, nisl nunc commodo ligula, id auctor nulla eros
            ut turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec euismod, nisi eu consectetur interdum, nisl nunc commodo
            ligula, id auctor nulla eros ut turpis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec euismod, nisi eu consectetur
            interdum, nisl nunc commodo ligula, id auctor nulla eros ut turpis.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisi eu consectetur interdum, nisl nunc commodo ligula, id
            auctor nulla eros ut turpis. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec euismod, nisi eu consectetur interdum, nisl
            nunc commodo ligula, id auctor nulla eros ut turpis. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi eu
            consectetur interdum, nisl nunc commodo ligula, id auctor nulla eros
            ut turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec euismod, nisi eu consectetur interdum, nisl nunc commodo
            ligula, id auctor nulla eros ut turpis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec euismod, nisi eu consectetur
            interdum, nisl nunc commodo ligula, id auctor nulla eros ut turpis.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisi eu consectetur interdum, nisl nunc commodo ligula, id
            auctor nulla eros ut turpis. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec euismod, nisi eu consectetur interdum, nisl
            nunc commodo ligula, id auctor nulla eros ut turpis. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi eu
            consectetur interdum, nisl nunc commodo ligula, id auctor nulla eros
            ut turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec euismod, nisi eu consectetur interdum, nisl nunc commodo
            ligula, id auctor nulla eros ut turpis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec euismod, nisi eu consectetur
            interdum, nisl nunc commodo ligula, id auctor nulla eros ut turpis.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisi eu consectetur interdum, nisl nunc commodo ligula, id
            auctor nulla eros ut turpis. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec euismod, nisi eu consectetur interdum, nisl
            nunc commodo ligula, id auctor nulla eros ut turpis. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi eu
            consectetur interdum, nisl nunc commodo ligula, id auctor nulla eros
            ut turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec euismod, nisi eu consectetur interdum, nisl nunc commodo
            ligula, id auctor nulla eros ut turpis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec euismod, nisi eu consectetur
            interdum, nisl nunc commodo ligula, id auctor nulla eros ut turpis.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisi eu consectetur interdum, nisl nunc commodo ligula, id
            auctor nulla eros ut turpis. consectetur interdum, nisl nunc commodo
            ligula, id auctor nulla eros ut turpis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec euismod, nisi eu consectetur
            interdum, nisl nunc commodo ligula, id auctor nulla eros ut turpis.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisi eu consectetur interdum, nisl nunc commodo ligula, id
            auctor nulla eros ut turpis. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec euismod, nisi eu consectetur interdum, nisl
            nunc commodo ligula, id auctor nulla eros ut turpis. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi eu
            consectetur interdum, nisl nunc commodo ligula, id auctor nulla eros
            ut turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec euismod, nisi eu consectetur interdum, nisl nunc commodo
            ligula, id auctor nulla eros ut turpis. consectetur interdum, nisl
            nunc commodo ligula, id auctor nulla eros ut turpis. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi eu
            consectetur interdum, nisl nunc commodo ligula, id auctor nulla eros
            ut turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec euismod, nisi eu consectetur interdum, nisl nunc commodo
            ligula, id auctor nulla eros ut turpis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec euismod, nisi eu consectetur
            interdum, nisl nunc commodo ligula, id auctor nulla eros ut turpis.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisi eu consectetur interdum, nisl nunc commodo ligula, id
            auctor nulla eros ut turpis. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec euismod, nisi eu consectetur interdum, nisl
            nunc commodo ligula, id auctor nulla eros ut turpis. consectetur
            interdum, nisl nunc commodo ligula, id auctor nulla eros ut turpis.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisi eu consectetur interdum, nisl nunc commodo ligula, id
            auctor nulla eros ut turpis. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec euismod, nisi eu consectetur interdum, nisl
            nunc commodo ligula, id auctor nulla eros ut turpis. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi eu
            consectetur interdum, nisl nunc commodo ligula, id auctor nulla eros
            ut turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec euismod, nisi eu consectetur interdum, nisl nunc commodo
            ligula, id auctor nulla eros ut turpis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec euismod, nisi eu consectetur
            interdum, nisl nunc commodo ligula, id auctor nulla eros ut turpis.
            consectetur interdum, nisl nunc commodo ligula, id auctor nulla eros
            ut turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec euismod, nisi eu consectetur interdum, nisl nunc commodo
            ligula, id auctor nulla eros ut turpis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec euismod, nisi eu consectetur
            interdum, nisl nunc commodo ligula, id auctor nulla eros ut turpis.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            euismod, nisi eu consectetur interdum, nisl nunc commodo ligula, id
            auctor nulla eros ut turpis. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec euismod, nisi eu consectetur interdum, nisl
            nunc commodo ligula, id auctor nulla eros ut turpis. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi eu
            consectetur interdum, nisl nunc commodo ligula, id auctor nulla eros
            ut turpis.
          </p>
        </div>
        <div className={styles.actionsContainer}>
          <label className={styles.checkboxContainer}>
            <input type="checkbox" checked={isAccepted} disabled />
            Lisans sözleşmesini okudum ve kabul ediyorum.
          </label>
          <div className={styles.buttonContainer}>
            <button
              className={styles.acceptButton}
              onClick={handleAccept}
              disabled={!isAccepted}
            >
              Kabul Et
            </button>
            <button className={styles.rejectButton} onClick={handleReject}>
              Reddet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
