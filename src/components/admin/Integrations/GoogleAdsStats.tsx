import React, { useEffect, useState } from "react";
import styles from "@/src/styles/admin/Integrations/GoogleAdsStats.module.scss";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdData } from "@/src/@types/components";
import Link from "next/link";
import { getAPIPath } from "@/src/lib/helpers/api";

const GoogleAdsStats: React.FC = () => {
  const [data, setData] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    fetchGoogleAdsData();
  }, []);

  const fetchGoogleAdsData = async () => {
    setLoading(true);
    setTimeout(async () => {
      const response = await fetch(getAPIPath("ad-stats"));
      const data = await response.json();

      if (!response.ok) {
        setApiConnected(false);
        setLoading(false);
        return;
      }

      setApiConnected(true);
      setData(data.data);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Google Ads İstatistikleri</h2>
          <button onClick={fetchGoogleAdsData}>
            <FontAwesomeIcon icon={faSyncAlt} /> Yenile
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Google API ile Bağlantı...</p>
          </div>
        ) : apiConnected ? (
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Kampanya ID</th>
                  <th>Kampanya Adı</th>
                  <th>Tıklamalar</th>
                  <th>Gösterimler</th>
                  <th>TO (CTR)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.campaign}</td>
                    <td>{row.clicks}</td>
                    <td>{row.impressions}</td>
                    <td>{row.ctr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.errorContainer}>
            <h2 className={styles.errorTitle}>API Bağlantısı Kurulamadı</h2>
            <p className={styles.errorMessage}>
              API Bağlantısını tamamlamak için lütfen{" "}
              <Link
                className={styles.underline}
                href="/dashboard/integrations/google-ads"
              >
                Entegrasyonlar &gt; Google Ads
              </Link>{" "}
              Sekmesine gidin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAdsStats;
