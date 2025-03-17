import type { SEOProps } from "@/src/@types/components";
import { join } from "path";
import { getKeyConditionally } from "@/src/lib/helpers/objects";
import { useUploadData } from "./UploadData";
import { useRouter } from "next/router";
import { replaceName } from "@/src/lib/helpers/seo";

const Seo: React.FC<SEOProps> = ({ title, description, keywords, data }) => {
  const router = useRouter();

  const { seo, texts } = useUploadData();
  const { page, component } = seo!;
  const { favicon, manifest } = page;

  const ORGANIZATION_NAME = getKeyConditionally(texts, "name", "");
  const TITLE = replaceName(title, ORGANIZATION_NAME);
  const DESCRIPTION = replaceName(description, ORGANIZATION_NAME);
  const KEYWORDS = replaceName(keywords, ORGANIZATION_NAME);

  const PUBLIC_URL =
    process.env.NEXT_PUBLIC_SITE_URL || component.footer.poweredBy.url;
  const CURRENT_URL = join(PUBLIC_URL, router.pathname);
  const OG_IMAGE = join(PUBLIC_URL, page.ogImage);

  const FAVICON_URL = favicon;
  const MANIFEST_URL = manifest;

  return (
    <>
      <title>{TITLE}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />

      <meta name="author" content={ORGANIZATION_NAME} />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="description" content={DESCRIPTION} />
      <meta name="robots" content="index, follow" />

      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={CURRENT_URL} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:type" content={page.ogType} />
      <meta property="og:locale" content={page.ogLocale} />

      <meta property="twitter:title" content={TITLE} />
      <meta property="twitter:description" content={DESCRIPTION} />
      <meta property="twitter:image" content={OG_IMAGE} />

      <link rel="icon" href={FAVICON_URL} type="image/png" />
      <link rel="manifest" href={MANIFEST_URL} />

      <link rel="canonical" href={CURRENT_URL} />

      <script type="application/ld+json">
        {data ??
          JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: TITLE,
            url: CURRENT_URL,
            description: DESCRIPTION,
            publisher: {
              "@type": "Organization",
              name: TITLE,
              url: PUBLIC_URL,
              logo: OG_IMAGE,
            },
          })}
      </script>
    </>
  );
};

export default Seo;
