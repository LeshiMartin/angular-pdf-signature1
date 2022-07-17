import { Injectable } from '@angular/core';
import { PdfViewerBuilderService } from './pdf-viewer-builder.service';
import { PDFViewer, PDFLinkService } from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjs from 'pdfjs-dist';
import { TypedArray } from 'pdfjs-dist/types/src/display/api';

@Injectable()
export class PdfViewerService {
  constructor(private pdfViewerBuilderService: PdfViewerBuilderService) {}

  getPdfViewer(div: HTMLDivElement) {
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

  async processFile(file: File, pdfViewer: PDFViewer) {
    const fileBuffer = await file.arrayBuffer();
    const fileRef = await pdfjs.getDocument(fileBuffer as TypedArray).promise;
    pdfViewer.setDocument(fileRef);
    (pdfViewer.linkService as PDFLinkService).setDocument(fileRef);
  }

  subscribeOnEvent(pdfViewer: PDFViewer, event: EventBusEvents, callback: any) {
    pdfViewer.eventBus.on(event, callback);
  }
}

export type EventBusEvents = 'pagesloaded' | 'pagerendered' | 'pagesinit';
