/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/components/Header.module.scss";
import {
  faBars,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getKeyConditionally } from "../lib/helpers/objects";
import { useUploadData } from "./utils/UploadData";
import { seoTextReplacer } from "../lib/helpers/seo";
import Link from "next/link";

const MENU_LINKS = [
  { label: "Anasayfa", href: "/" },
  {
    label: "Kurumsal",
    href: "#",
    subLinks: [
      { label: "Hakkımızda", href: "/about" },
      { label: "Vizyonumuz", href: "/vision" },
      { label: "Referanslarımız", href: "/references" },
    ],
  },
  { label: "Hizmetler", href: "/services" },
  { label: "Projeler", href: "/projects" },
  {
    label: "Ürünler",
    href: "#",
    subLinks: [
      { label: "Kataloglar", href: "/catalogs" },
      { label: "Kategoriler", href: "/categories" },
    ],
  },
  { label: "İletişim", href: "/contact" },
];

const Header: React.FC = () => {
  const { texts = {}, seo } = useUploadData();
  const {
    logo: { path, alt },
  } = seo!.component.header;

  const ORGANIZATION_NAME = getKeyConditionally(texts, "name", "");
  const LOGO_ALT = seoTextReplacer(alt, {
    name: ORGANIZATION_NAME,
  });
  const LOGO_SRC = path;

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [openSideMenuIndex, setOpenSideMenuIndex] = useState<number | null>(
    null
  );
  const sideMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sideMenuRef.current &&
      !sideMenuRef.current.contains(event.target as Node)
    ) {
      setIsSideMenuOpen(false);
      setOpenSideMenuIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubMenu = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const toggleSideSubMenu = (index: number) => {
    setOpenSideMenuIndex(openSideMenuIndex === index ? null : index);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.container}>
        <div className={styles.logoAndNavigation}>
          <div className={styles.logo}>
            <Link href="/">
              <img src={LOGO_SRC} alt={LOGO_ALT} />
            </Link>
          </div>
          <nav className={styles.navLinks}>
            <ul>
              {MENU_LINKS.map((link, index) => (
                <li
                  key={index}
                  className={link.subLinks ? styles.corporateMenu : ""}
                  onMouseEnter={() => link.subLinks && setOpenMenuIndex(index)}
                  onMouseLeave={() => link.subLinks && setOpenMenuIndex(null)}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.subLinks) {
                        e.preventDefault();
                        toggleSubMenu(index);
                      }
                    }}
                  >
                    {link.label}
                    {link.subLinks && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={styles.dropdownIcon}
                      />
                    )}
                  </a>
                  {link.subLinks && openMenuIndex === index && (
                    <ul className={styles.subMenu}>
                      {link.subLinks.map((subLink, subIndex) => (
                        <li key={subIndex}>
                          <a href={subLink.href}>{subLink.label}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.iconLinks}>
            <button
              className={styles.menuButton}
              onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={sideMenuRef}
        className={`${styles.sideMenu} ${isSideMenuOpen ? styles.open : ""}`}
      >
        <div className={styles.logo}>
          <img src={LOGO_SRC} alt={LOGO_ALT} />
        </div>
        {MENU_LINKS.map((link, index) => (
          <div key={index}>
            {!link.subLinks ? (
              <a
                href={link.href}
                onClick={() => setIsSideMenuOpen(false)}
                className={styles.menuItem}
              >
                {link.label}
              </a>
            ) : (
              <div
                className={`${styles.sideCorporateMenu} ${
                  openSideMenuIndex === index ? styles.open : ""
                }`}
              >
                <a
                  onClick={() => toggleSideSubMenu(index)}
                  className={styles.menuItem}
                >
                  {link.label}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`${styles.dropdownIcon} ${
                      openSideMenuIndex === index ? styles.rotate : ""
                    }`}
                  />
                </a>
                <div className={styles.subMenu}>
                  {link.subLinks.map((subLink, subIndex) => (
                    <a
                      key={subIndex}
                      href={subLink.href}
                      onClick={() => setIsSideMenuOpen(false)}
                      className={styles.subMenuItem}
                    >
                      {subLink.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <button
          className={styles.closeButton}
          onClick={() => setIsSideMenuOpen(false)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </header>
  );
};

export default Header;
