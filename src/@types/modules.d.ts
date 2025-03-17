declare module 'react-flip-page' {
  import { FC } from 'react';
  const FlipPage: FC<unknown>; 
  export default FlipPage;
}
  
declare module 'pdfjs-dist' {
  import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
    
  export function getDocument(src: string | Uint8Array): { promise: Promise<PDFDocumentProxy> };
  export { PDFDocumentProxy, PDFPageProxy };
}