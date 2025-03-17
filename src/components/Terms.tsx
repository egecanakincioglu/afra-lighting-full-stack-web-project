import React from "react";
import styles from "../styles/components/TermsOfService.module.scss";
import { useUploadData } from "./utils/UploadData";
import { getKeyConditionally } from "../lib/helpers/objects";
import { replaceName, seoTextReplacer } from "../lib/helpers/seo";

const TermsOfService: React.FC = () => {
  const { texts = {}, seo } = useUploadData();
  const {
    title: { text },
    sections,
  } = seo!.component.terms;

  const ORGANIZATION_NAME = getKeyConditionally(texts, "name", "");
  const CONTACT_EMAIL = getKeyConditionally(texts.contact, "email", "");
  const CONTACT_PHONE = getKeyConditionally(texts.contact, "phone", "");
  const TERMS_TITLE = replaceName(text, ORGANIZATION_NAME);

  const replacerData = {
    name: ORGANIZATION_NAME,
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE,
    style: styles.link,
  };

  const SECTIONS = sections.map((section) => ({
    title: section.title,
    content: seoTextReplacer(section.content, replacerData),
    warnings: section.warnings,
  }));

  return (
    <section className={styles.termsContainer}>
      <div className={styles.termsContent}>
        <h2 className={styles.termsTitle}>{TERMS_TITLE}</h2>
        <p className={styles.termsText}>
          {ORGANIZATION_NAME} olarak, kullanıcılarımızın gizliliğine ve veri
          güvenliğine büyük önem veriyoruz. Web sitemizi kullanarak bu Şartlar
          ve Koşullar’ı kabul etmiş sayılırsınız. Detaylı bilgi için lütfen
          aşağıdaki koşulları dikkatlice okuyunuz.
        </p>

        {SECTIONS.map((section, index) => (
          <div key={index}>
            <h3 className={styles.sectionHeading}>{section.title}</h3>
            <p
              className={styles.termsText}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
            {section.warnings && (
              <ul className={styles.bulletList}>
                {section.warnings.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TermsOfService;
