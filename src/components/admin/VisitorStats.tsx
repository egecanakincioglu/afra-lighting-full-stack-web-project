import React, { useEffect, useState } from "react";
import styles from "@/src/styles/admin/VisitorStats.module.scss";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { pathTranslations } from "@/src/lib/config/files";
import type { VisitData } from "@/src/@types/database";
import { getAPIPath } from "@/src/lib/helpers/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const options = {
  maintainAspectRatio: false,
};

const VisitorStats: React.FC = () => {
  const [visitData, setVisitData] = useState<VisitData[]>([]);

  useEffect(() => {
    const fetchVisitData = async () => {
      const response = await fetch(getAPIPath("visits"));
      const data = await response.json();
      setVisitData(data);
    };

    fetchVisitData();
  }, []);

  const uniqueCountries = [...new Set(visitData.map((v) => v.country))].filter(
    (country) => country !== "Unknown"
  );
  const colors = [
    "#15afd1",
    "#ab0f53",
    "#e055d7",
    "#dbd9da",
    "#9e7965",
    "#9966ff",
    "#e68845",
    "#5cccb9",
    "#d9b864",
    "#692de0",
    "#1129c2",
    "#f2e1d8",
    "#111211",
    "#37333d",
    "#0e4245",
    "#14619c",
  ];

  const countryData = {
    labels: uniqueCountries,
    datasets: [
      {
        label: "Ülkelere Göre Ziyaret",
        data: uniqueCountries.map(
          (country) => visitData.filter((v) => v.country === country).length
        ),
        backgroundColor: colors.slice(0, uniqueCountries.length),
      },
    ],
  };

  const pageViews = [...new Set(visitData.map((v) => v.pageViewed))];

  const pageData = {
    labels: pageViews
      .map((page) => pathTranslations[page as keyof typeof pathTranslations])
      .filter((item) => item !== undefined),
    datasets: [
      {
        label: "Sayfa Görüntülemeleri",
        data: pageViews.map(
          (page) => visitData.filter((v) => v.pageViewed === page).length
        ),
        backgroundColor: "#f9a22e",
      },
    ],
  };

  const dateViews = [
    ...new Set(
      visitData.map((v) => new Date(v.visitDate).toLocaleDateString())
    ),
  ];

  const dateData = {
    labels: dateViews,
    datasets: [
      {
        label: "Günlük Ziyaret",
        data: dateViews.map(
          (date) =>
            visitData.filter(
              (v) => new Date(v.visitDate).toLocaleDateString() === date
            ).length
        ),
        borderColor: "#dc3545",
        fill: false,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ziyaretçi İstatistikleri</h2>

      <div className={styles.charts}>
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Ülkelere Göre Dağılım</h3>
          <Pie data={countryData} options={options} />
        </div>

        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Sayfa Görüntülemeleri</h3>
          <Bar data={pageData} options={options} />
        </div>

        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Günlük Ziyaretler</h3>
          <Line data={dateData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;
