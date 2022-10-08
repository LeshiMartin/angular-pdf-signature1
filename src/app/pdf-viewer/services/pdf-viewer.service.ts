import { Injectable } from '@angular/core';
import { PdfViewerBuilderService } from './pdf-viewer-builder.service';
import { PDFViewer, PDFLinkService } from 'pdfjs-dist/web/pdf_viewer';
import { PdfServiceModule } from '../pdf-services.module';
import { InternalPdfViewer } from '../types/internal-pdf-viewer';

@Injectable({
  providedIn: PdfServiceModule,
})
export class PdfViewerService {
  constructor(private pdfViewerBuilderService: PdfViewerBuilderService) {}

  getPdfViewer(div: HTMLDivElement): InternalPdfViewer {
    const eventBus = this.pdfViewerBuilderService.constructEventBus();
    const linkService =
      this.pdfViewerBuilderService.constructLinkService(eventBus);
    const pdfViewer = this.pdfViewerBuilderService.constructPdfViewer(
      div,
      linkService,
      eventBus
    );
    this.subscribeOnEvent(pdfViewer, 'pagesloaded', () => {
      this.pdfViewerBuilderService.setViewerScale(pdfViewer, 'page-width');
    });
    return pdfViewer;
  }

  subscribeOnEvent(pdfViewer: PDFViewer, event: EventBusEvents, callback: any) {
    pdfViewer.eventBus.on(event, callback);
  }
}

export type EventBusEvents = 'pagesloaded' | 'pagerendered' | 'pagesinit';
