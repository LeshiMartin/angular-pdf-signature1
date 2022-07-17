import { Injectable } from '@angular/core';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import { EventBus, PDFLinkService, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import { environment } from '../../../environments/environment';
import { AnnotationMode, GlobalWorkerOptions, version } from 'pdfjs-dist';

@Injectable()
export class PdfViewerBuilderService {
  constructor() {
    GlobalWorkerOptions.workerSrc = environment.pdfWorker(version);
  }

  constructPdfViewer(
    div: HTMLDivElement,
    linkService: PDFLinkService,
    eventBus: EventBus,
    scaleValue: PdfViewerScaleValues = 'page-width'
  ): PDFViewer {
    const pdfViewer = new pdfjsViewer.PDFViewer({
      container: div,
      linkService: linkService,
      eventBus: eventBus,
      l10n: pdfjsViewer.NullL10n,
      textLayerMode: environment.TEXT_LAYER_MODE,
      renderer: environment.RENDERER,
      maxCanvasPixels: environment.MAX_CANVAS_PIXELS,
      annotationMode: AnnotationMode.ENABLE,
      useOnlyCssZoom: environment.USE_ONLY_CSS_ZOOM,
    });
    linkService.setViewer(pdfViewer);
    pdfViewer.currentScaleValue = scaleValue;
    return pdfViewer;
  }

  setViewerScale(pdfViewer: PDFViewer, scaleValue: PdfViewerScaleValues) {
    pdfViewer.currentScaleValue = scaleValue;
  }

  constructLinkService(eventBus: EventBus): PDFLinkService {
    const linkService = new pdfjsViewer.PDFLinkService({
      eventBus: eventBus,
    });
    return linkService;
  }

  constructEventBus(): EventBus {
    const eventBus = new pdfjsViewer.EventBus();
    return eventBus;
  }
}

export type PdfViewerScaleValues =
  | 'page-width'
  | 'page-height'
  | 'page-fit'
  | 'page-actual';
