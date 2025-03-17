import ContactForm from "../components/ContactForm";
import ContactUsTitle from "../components/ContactUsTitle";
import Footer from "../components/Footer";
import Header from "../components/Header";
import React from "react";
import styles from "../styles/pages/Contact.module.scss";
import {
  UploadDataProvider,
  useUploadData,
} from "../components/utils/UploadData";
import { getKeyConditionally } from "../lib/helpers/objects";
import Seo from "../components/utils/Seo";
import { join } from "path";
import { useRouter } from "next/router";

const Contact: React.FC = () => {
  const router = useRouter();
  const { texts = {}, seo } = useUploadData();

  const { page, component } = seo!;
  const { pages } = page;
  const {
    contact: {
      title,
      description,
      keywords,
      work: { days, startTime, endTime },
      serviceArea,
      languages,
    },
  } = pages;

  const PUBLIC_URL =
    process.env.NEXT_PUBLIC_SITE_URL || component.footer.poweredBy.url;

  const CONTACT_EMAIL = getKeyConditionally(texts.contact, "email", "");
  const PHONE_NUMBER = getKeyConditionally(texts.contact, "phone", "");
  const CURRENT_URL = join(PUBLIC_URL, router.pathname);

  const seoData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: title,
    url: CURRENT_URL,
    description: description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_NUMBER,
      email: CONTACT_EMAIL,
      contactType: "Customer Service",
      areaServed: serviceArea,
      availableLanguage: languages,
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days,
        opens: startTime,
        closes: endTime,
      },
    },
  });

  return (
    <>
      <Seo
        title={title}
        description={description}
        keywords={keywords}
        data={seoData}
      />

      <div className={styles.container}>
        <Header />
        <main className={styles.generalSection}>
          <div className={styles.generalSection}>
            <ContactUsTitle />
          </div>
          <div className={styles.generalSection}>
            <UploadDataProvider fileCategories={["products"]} texts>
              <ContactForm />
            </UploadDataProvider>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
