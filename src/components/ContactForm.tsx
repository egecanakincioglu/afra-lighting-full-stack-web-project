import styles from "../styles/components/ContactForm.module.scss";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { getKeyConditionally, getProductFile } from "../lib/helpers/objects";
import { useUploadData } from "./utils/UploadData";
import type { RequestResult } from "../@types/database";
import { parseWhatsAppNumber, stylePhoneNumber } from "../lib/helpers/strings";
import { getAPIPath } from "../lib/helpers/api";
import { useRouter } from "next/router";
import { isString } from "../lib/helpers/verifications";

const ContactSection: React.FC = () => {
  const { texts = {}, files: { products = [] } = {} } = useUploadData();
  const router = useRouter();

  const productId = router.query["productId"];

  const product = isString(productId)
    ? getProductFile(products.find(({ id }) => id === productId))
    : undefined;

  const { metadata } = product ?? {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: metadata?.name ? `${metadata.name} Hakkında Detaylı Bilgi` : "",
    message: metadata?.name
      ? `Merhaba, ${metadata.name} isimli${
          metadata.code ? ` ${metadata.code} koduna sahip ` : " "
        }ürün hakkında detaylı bilgi almak istiyorum.`
      : "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const STYLED_PHONE_NUMBER = stylePhoneNumber(
    getKeyConditionally(texts.contact, "phone", "")
  );
  const PHONE_NUMBER = STYLED_PHONE_NUMBER.replaceAll(/[ ()]/g, "");

  const EMAIL = getKeyConditionally(texts.contact, "email", "");
  const WHATSAPP_URL = getKeyConditionally(texts.social, "whatsapp", "");
  const WHATSAPP_NUMBER = stylePhoneNumber(
    parseWhatsAppNumber(WHATSAPP_URL) ?? ""
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    try {
      const result = await fetch(getAPIPath("messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data: RequestResult = await result.json();

      if (!data.status) {
        const { message } = data;
        return setError(message);
      }

      setSuccess("Mesaj başarıyla gönderildi.");
      setError("");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setSuccess("");
      setError("Sistemsel bir hata oluştu.");
    }
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.contactInfo}>
          <h3>Projenizi Tartışalım</h3>
          <p>
            Ürün tasarımı girişimleri veya potansiyel iş birlikleri hakkında
            görüşmek için her zaman ulaşabilirsiniz.
          </p>
          <ul>
            <li>
              <FontAwesomeIcon icon={faPhone} className={styles.icon} />
              <a href={`tel:${PHONE_NUMBER}`}>{STYLED_PHONE_NUMBER}</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faWhatsapp} className={styles.icon} />
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                {WHATSAPP_NUMBER}
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.contactForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                placeholder="Adınız"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="E-posta Adresiniz"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Konu"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                name="message"
                placeholder="Mesajınız"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Mesaj Gönder
            </button>
            {error && (
              <div className="text-center text-red-600">
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="text-center text-green-600">
                <p>{success}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
