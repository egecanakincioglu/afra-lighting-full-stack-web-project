import Image from "next/image";
import React, { useState } from "react";
import styles from "@/src/styles/admin/AdminNavbar.module.scss";
import {
  faBars,
  faChevronDown,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const AdminNavbar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prevState) => (prevState === menuName ? null : menuName));
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <button onClick={toggleNavbar} className={styles.hamburgerButton}>
        <FontAwesomeIcon
          icon={isCollapsed ? faBars : faTimes}
          className={styles.icon}
        />
      </button>

      <nav
        className={`${styles.navbar} ${isCollapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image
              src="/main-logo.webp"
              alt="Afra Lighting Logo"
              width={150}
              height={50}
            />
          </Link>
        </div>
        <ul className={styles.menu}>
          <li>
            <Link href="/dashboard/view">İstatistikler</Link>
          </li>
          <li
            onClick={() => toggleMenu("corporateSettings")}
            className={openMenu === "corporateSettings" ? styles.active : ""}
          >
            <span>
              Kurumsal Ayarlar
              <FontAwesomeIcon
                icon={
                  openMenu === "corporateSettings"
                    ? faChevronDown
                    : faChevronRight
                }
                className={styles.chevronIcon}
              />
            </span>
            {openMenu === "corporateSettings" && (
              <ul className={styles.subMenu}>
                <li>
                  <Link href="/dashboard/corporate/update-logo">
                    Logo Güncelleme
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/corporate/update-name">
                    İsim Güncelleme
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/corporate/update-contact">
                    İletişim Bilgileri
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/corporate/update-social">
                    Sosyal Medya
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/corporate/manage-references">
                    Referans Yönetimi
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li
            onClick={() => toggleMenu("siteSettings")}
            className={openMenu === "siteSettings" ? styles.active : ""}
          >
            <span>
              Site Ayarları
              <FontAwesomeIcon
                icon={
                  openMenu === "siteSettings" ? faChevronDown : faChevronRight
                }
                className={styles.chevronIcon}
              />
            </span>
            {openMenu === "siteSettings" && (
              <ul className={styles.subMenu}>
                <li>
                  <Link href="/dashboard/site/update-banners">
                    Banner Güncelleme
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/site/update-ads">Reklam Panoları</Link>
                </li>
                <li>
                  <Link href="/dashboard/site/update-favorites">
                    Favori Ürünler
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/site/update-working-areas">
                    Çalışma Alanları
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/site/update-about">Hakkımızda</Link>
                </li>
                <li>
                  <Link href="/dashboard/site/update-vision">Vizyon</Link>
                </li>
              </ul>
            )}
          </li>
          <li
            onClick={() => toggleMenu("adminSettings")}
            className={openMenu === "adminSettings" ? styles.active : ""}
          >
            <span>
              Yönetici Ayarları
              <FontAwesomeIcon
                icon={
                  openMenu === "adminSettings" ? faChevronDown : faChevronRight
                }
                className={styles.chevronIcon}
              />
            </span>
            {openMenu === "adminSettings" && (
              <ul className={styles.subMenu}>
                <li>
                  <Link href="/dashboard/admin/update-email">
                    Email Güncelleme
                  </Link>
                  <Link href="/dashboard/admin/update-password">
                    Şifre Güncelleme
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li
            onClick={() => toggleMenu("products")}
            className={openMenu === "products" ? styles.active : ""}
          >
            <span>
              Ürünler
              <FontAwesomeIcon
                icon={openMenu === "products" ? faChevronDown : faChevronRight}
                className={styles.chevronIcon}
              />
            </span>
            {openMenu === "products" && (
              <ul className={styles.subMenu}>
                <li>
                  <Link href="/dashboard/products/update-catalog">
                    Katalog Yükleme
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/products/update-categories">
                    Kategorileri Güncelle
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li
            onClick={() => toggleMenu("services")}
            className={openMenu === "services" ? styles.active : ""}
          >
            <span>
              Hizmetler
              <FontAwesomeIcon
                icon={openMenu === "services" ? faChevronDown : faChevronRight}
                className={styles.chevronIcon}
              />
            </span>
            {openMenu === "services" && (
              <ul className={styles.subMenu}>
                <li>
                  <Link href="/dashboard/services/update-services">
                    Hizmetleri Yönet
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li
            onClick={() => toggleMenu("projects")}
            className={openMenu === "projects" ? styles.active : ""}
          >
            <span>
              Projeler
              <FontAwesomeIcon
                icon={openMenu === "projects" ? faChevronDown : faChevronRight}
                className={styles.chevronIcon}
              />
            </span>
            {openMenu === "projects" && (
              <ul className={styles.subMenu}>
                <li>
                  <Link href="/dashboard/projects/update-projects">
                    Projeleri Yönet
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li
            onClick={() => toggleMenu("integrations")}
            className={openMenu === "integrations" ? styles.active : ""}
          >
            <span>
              Entegrasyonlar
              <FontAwesomeIcon
                icon={
                  openMenu === "integrations" ? faChevronDown : faChevronRight
                }
                className={styles.chevronIcon}
              />
            </span>
            {openMenu === "integrations" && (
              <ul className={styles.subMenu}>
                <li>
                  <Link href="/dashboard/integrations/google-ads">
                    Google Ads
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/dashboard/support">Destek</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default AdminNavbar;
