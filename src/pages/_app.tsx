import { UploadDataProvider } from "../components/utils/UploadData";
import "../styles/globals.scss";

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: React.FC<unknown[]>;
  pageProps: unknown[];
}) {
  return (
    <UploadDataProvider seo texts>
      <Component {...pageProps} />
    </UploadDataProvider>
  );
}
