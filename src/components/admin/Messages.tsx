import React, { useEffect, useState } from "react";
import styles from "@/styles/admin/Messages.module.scss";
import type { Message } from "@/src/@types/components";
import { getAPIPath } from "@/src/lib/helpers/api";

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>("Mesajlar yükleniyor...");

  useEffect(() => {
    (async () => {
      const response = await fetch(getAPIPath("messages"));

      if (!response.ok) {
        return setError("Mesajları yüklerken bir hata oluştu");
      }

      const data = await response.json();
      const messageData: Message[] = data.data?.messages ?? [];

      if (!messageData.length) {
        setError("Mesaj bulunamadı");
      }

      setMessages(messageData);
    })();
  }, []);

  const handleDelete = async (id: number) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    if (messages.length === 1) {
      setError("Mesaj bulunamadı");
    }

    await fetch(getAPIPath("messages"), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  return (
    <div className={styles.messagesContainer}>
      <h3>Gelen Mesajlar</h3>
      <div className={styles.messageList}>
        {messages.length ? (
          messages.map((msg) => (
            <div key={msg.id} className={styles.messageItem}>
              <p>
                <strong>İsim:</strong> {msg.name}
              </p>
              <p>
                <strong>E-Posta Adresi:</strong> {msg.email}
              </p>
              <p>
                <strong>Başlık:</strong> {msg.subject}
              </p>
              <p>
                <strong>Mesaj:</strong> {msg.message}
              </p>
              <div className={styles.buttonContainer}>
                <a
                  href={`mailto:${msg.email}?subject=${encodeURIComponent(
                    `${msg.subject} Konusu Hakkında`
                  )}&body=${encodeURIComponent(
                    `Merhaba ${msg.name},\n\n${msg.subject} konulu mailiniz bize ulaştı. Bu mail size yanıt vermek için Afra Lighting tarafından yazılmıştır.\n`
                  )}`}
                  className={styles.replyButton}
                >
                  Yanıtla
                </a>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className={styles.deleteButton}
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.messageItem}>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
