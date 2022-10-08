import { PDFViewerOptions } from 'pdfjs-dist/types/web/base_viewer';
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
export class InternalPdfViewer extends PDFViewer {
  constructor(init: PDFViewerOptions) {
    super(init);
  }
}
