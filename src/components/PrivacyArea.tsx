import React from "react";
import styles from "../styles/components/Privacy.module.scss";
import { useUploadData } from "./utils/UploadData";
import { getKeyConditionally } from "../lib/helpers/objects";
import { replaceName, seoTextReplacer } from "../lib/helpers/seo";

const PrivacyPolicy: React.FC = () => {
  const { texts = {}, seo } = useUploadData();
  const {
    title: { text },
    intro,
    sections,
  } = seo!.component.privacy;

  const CONTACT_EMAIL = getKeyConditionally(texts.contact, "email", "");
  const CONTACT_PHONE = getKeyConditionally(texts.contact, "phone", "");
  const ORGANIZATION_NAME = getKeyConditionally(texts, "name", "");
  const PRIVACY_POLICY_TITLE = replaceName(text, ORGANIZATION_NAME);

  const INTRO_TEXT = intro
    .map((item) => replaceName(item, ORGANIZATION_NAME))
    .join(" ");

  const replacerData = {
    name: ORGANIZATION_NAME,
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE,
  };

  const SECTIONS = sections.map((section) => ({
    title: section.title,
    content: seoTextReplacer(section.content, replacerData),
    warnings: section.warnings,
  }));

  return (
    <section className={styles.privacyContainer}>
      <div className={styles.privacyContent}>
        <h2 className={styles.privacyTitle}>{PRIVACY_POLICY_TITLE}</h2>
        <p className={styles.privacyText}>{INTRO_TEXT}</p>

        {SECTIONS.map((section, index) => (
          <div key={index}>
            <h3 className={styles.sectionHeading}>{section.title}</h3>
            <p
              className={styles.privacyText}
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

export default PrivacyPolicy;
