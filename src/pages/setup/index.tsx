import React, { useEffect } from "react";
import styles from "@/src/styles/pages/MainPage.module.scss";
import { useRouter } from "next/router";
import Information from "@/src/components/setup/Information";
import { getAPIPath } from "@/src/lib/helpers/api";

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkFirstLogin = async () => {
      const response = await fetch(getAPIPath("firstLogin"));
      const data = await response.json();

      if (!data.available) {
        router.push("/dashboard");
      }
    };

    checkFirstLogin();
  });

  return (
    <div className={styles.container}>
      <Information />
      <div className={styles.generalSection}></div>
    </div>
  );
};

export default HomePage;
