import React, { useEffect, useState } from "react";
import styles from "@/src/styles/admin/Integrations/ManageGoogleAds.module.scss";
import type { AdSettings } from "@/src/@types/database";
import LoadingElement from "../../LoadingElement";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { getAPIPath } from "@/src/lib/helpers/api";
import { useMessageState } from "@/src/lib/helpers/hooks";

const ManageGoogleAds: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [isOnNextStep, setIsOnNextStep] = useState(false);
  const [apiData, setApiData] = useState<Partial<AdSettings>>({});
  const [testResult, setTestResult] = useState("");

  const { setErrorMessage, setSuccessMessage, successMessage, errorMessage } =
    useMessageState();

  useEffect(() => {
    (async () => {
      const code = searchParams.get("code");
      const token = searchParams.get("state");

      if (!code || !token) {
        return setLoading(false);
      }

      const response = await fetch(getAPIPath("google-callback"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.message !== "Already set") {
          setErrorMessage("API anahtarlarınızı kontrol ediniz.");
        } else {
          setIsOnNextStep(true);
        }

        return setLoading(false);
      }

      setIsOnNextStep(true);
      return setLoading(false);
    })();
  }, [searchParams]);

  if (loading) {
    return <LoadingElement />;
  }

  const handleInputChange = (key: keyof AdSettings) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setApiData({ ...apiData, [key]: e.target.value });
      if (errorMessage) setErrorMessage("");
      if (successMessage) setSuccessMessage("");
      if (testResult) setTestResult("");
    };
  };

  const handleSave = async () => {
    const resultData = (() => {
      return isOnNextStep
        ? {
            developerToken: apiData.developerToken,
            managerId: apiData.managerId,
            customerId: apiData.customerId,
          }
        : {
            clientId: apiData.clientId,
            clientSecret: apiData.clientSecret,
          };
    })();

    const values = Object.values(resultData);

    if (values.some((value) => !value?.trim().length)) {
      return setErrorMessage("Tüm alanları doldurunuz.");
    }

    const response = await fetch(getAPIPath("google-callback"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultData),
    });

    if (!response.ok) {
      return setErrorMessage("Girdiğiniz API anahtarlarında hata var.");
    }

    if (isOnNextStep) {
      return setSuccessMessage("API anahtarlarınız başarıyla kaydedildi.");
    }

    const {
      data: { authUrl },
    } = await response.json();

    router.push(authUrl);
  };

  const stepElements = isOnNextStep ? (
    <>
      <div className={styles.inputGroup}>
        <label htmlFor="developerToken">{"Geliştirici Tokeni"}</label>
        <input
          type="text"
          name="developerToken"
          required
          placeholder="Google Ads Geliştirici Tokeni (developer_token)"
          value={apiData.developerToken}
          onChange={handleInputChange("developerToken")}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="managerId">{"Yönetici ID'si"}</label>
        <input
          type="text"
          name="managerId"
          required
          placeholder="Google Ads Yönetici ID'si (manager_id)"
          value={apiData.managerId}
          onChange={handleInputChange("managerId")}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="customerId">{"Müşteri ID'si"}</label>
        <input
          type="text"
          name="customerId"
          required
          placeholder="Google Ads Müşteri ID'si (customer_id)"
          value={apiData.customerId}
          onChange={handleInputChange("customerId")}
        />
      </div>
    </>
  ) : (
    <>
      <div className={styles.inputGroup}>
        <label htmlFor="clientId">{"Hesap ID'si"}</label>
        <input
          type="text"
          name="clientId"
          required
          placeholder="Google Ads Client ID (client_id)"
          value={apiData.clientId}
          onChange={handleInputChange("clientId")}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="clientSecret">{"Hesap Tokeni"}</label>
        <input
          type="text"
          name="clientSecret"
          required
          placeholder="Google Ads Hesap Tokeni (client_secret)"
          value={apiData.clientSecret}
          onChange={handleInputChange("clientSecret")}
        />
      </div>
    </>
  );

  return (
    <div className={styles.googleAdsContainer}>
      <div className={styles.innerBox}>
        <h1>Google Ads Entegrasyonu</h1>
        <p className={styles.infoText}>
          Google Ads hesabınızı bağlamak için geçerli bir API anahtarı giriniz.
          API anahtarınızı{" "}
          <a
            href="https://console.developers.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Cloud Console
          </a>{" "}
          üzerinden alabilirsiniz.
          <br />
          <br />
          <strong>Not:</strong> OAuth2 doğrulamanızdaki yönlendirme yolu{" "}
          <strong>
            {process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations/google-ads
          </strong>{" "}
          şeklinde olmalıdır.
        </p>

        <form className={styles.integrationForm}>
          {stepElements}

          {errorMessage && (
            <span className={`${styles.feedbackText} ${styles.error}`}>
              {errorMessage}
            </span>
          )}
          {successMessage && (
            <span className={`${styles.feedbackText} ${styles.success}`}>
              {successMessage}
            </span>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleSave}
              className={styles.testButton}
            >
              {isOnNextStep ? "Kaydet ve Bitir" : "Sonraki Aşamaya Geç"}
            </button>
          </div>

          {testResult && (
            <p
              className={`${styles.feedbackText} ${
                testResult.includes("başarısız") ? styles.error : styles.success
              }`}
            >
              {testResult}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ManageGoogleAds;
