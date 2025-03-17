import Document, { Html, Head, Main, NextScript } from "next/document";
import { replaceName } from "../lib/helpers/seo";
import uploads from "../../database/metadata.json" assert { type: "json" };
import { getSEO } from "../modules/api/seo";

const PUBLIC_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://flareye.com";

class MyDocument extends Document {
  render() {
    const seo = getSEO();

    const { page } = seo;
    const { font, favicon, manifest, keywords, name, description } = page;

    const [FAVICON_URL, MANIFEST_URL, KEYWORDS, NAME, DESCRIPTION] = [
      favicon,
      manifest,
      keywords,
      name,
      description,
    ].map((item) => replaceName(item, uploads.texts?.name ?? ""));

    return (
      <Html lang="tr">
        <Head>
          {/* Meta Etiketleri */}
          <meta name="description" content={DESCRIPTION} />
          <meta name="author" content={NAME} />
          <meta name="keywords" content={KEYWORDS} />
          <meta name="robots" content="index, follow" />

          <meta property="og:title" content={NAME} />

          {/* Google Fonts Preload */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link href={font} rel="stylesheet" />
          <style>{`* { font-family: Nunito; }`}</style>

          {/* Favicons */}
          <link rel="icon" href={FAVICON_URL} type="image/png" />
          <link rel="manifest" href={MANIFEST_URL} />

          {/* Canonical URL */}
          <link rel="canonical" href={PUBLIC_URL} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
