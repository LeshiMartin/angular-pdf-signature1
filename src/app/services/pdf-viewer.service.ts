// import { Injectable } from '@angular/core';
// import * as pdfjs from 'pdfjs-dist';
// import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
// import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
// import { environment } from '../../environments/environment';
// import {
//   AnnotationMode,
//   GlobalWorkerOptions,
//   version,
// } from 'pdfjs-dist';

// @Injectable({
//   providedIn: 'root',
// })
// export class PdfViewerService {
//   private _linkService: pdfjsViewer.PDFLinkService | undefined;
//   private _eventBus: pdfjsViewer.EventBus | undefined;
//   private _pdfViewer: pdfjsViewer.PDFViewer | undefined;
//   private _pdfFileRef: Promise<pdfjs.PDFDocumentProxy> | undefined;

//   constructor() {
//     GlobalWorkerOptions.workerSrc = environment.pdfWorker(version);
//   }

//   async renderPdf(file: File, div: HTMLDivElement) {
//     const fileBuffer = await file.arrayBuffer();
//     this._pdfViewer = this.constructPdfViewer(div);
//     this._linkService?.setViewer(this._pdfViewer);
//     this.setScale('page-width');
//     this.viewThePdf(this._pdfViewer, this._linkService!, fileBuffer);
//     this.subscribeOnEvent(this._eventBus!, 'pagesloaded', () => {
//       this.setScale('page-width');
//     });
//   }

//   private subscribeOnEvent(
//     eventBus: pdfjsViewer.EventBus,
//     event: EventBusEvents,
//     callback: any
//   ) {
//     eventBus.on(event, callback);
//   }

//   private viewThePdf(
//     pdfViewer: PDFViewer,
//     linkService: pdfjsViewer.PDFLinkService,
//     pdfBuffer: any
//   ) {
//     this._pdfFileRef = pdfjs.getDocument(pdfBuffer).promise;
//     this._pdfFileRef
//       .then((pdf) => {
//         if (!pdfViewer) return;
//         pdfViewer.setDocument(pdf);
//         linkService.setDocument(pdf);
//       })
//       .catch((err) => err);
//   }

//   private constructPdfViewer(div: HTMLDivElement) {
//     this.constructLinkService();
//     return new pdfjsViewer.PDFViewer({
//       container: div,
//       renderer: environment.RENDERER,
//       linkService: this._linkService!,
//       eventBus: this._eventBus!,
//       l10n: pdfjsViewer.NullL10n,
//       maxCanvasPixels: environment.MAX_CANVAS_PIXELS,
//       useOnlyCssZoom: environment.USE_ONLY_CSS_ZOOM,
//       textLayerMode: environment.TEXT_LAYER_MODE,
//       annotationMode:AnnotationMode.ENABLE,
//       downloadManager: new pdfjsViewer.DownloadManager(),
//       enablePermissions: true,
//       enablePrintAutoRotate: true,
//       findController: new pdfjsViewer.PDFFindController({
//         eventBus: this._eventBus!,
//         linkService: this._linkService!,
//       }),
//       imageResourcesPath: './assets/images/',
//       pageColors: ['#ffffff', '#000000'],
//       removePageBorders: true,
//       viewer: div,
//     });
//   }

//   private constructLinkService() {
//     this._linkService = new pdfjsViewer.PDFLinkService({
//       eventBus: this.constructEventBus(),
//     });
//     return this._linkService;
//   }

//   private constructEventBus(): pdfjsViewer.EventBus {
//     this._eventBus = new pdfjsViewer.EventBus();
//     return this._eventBus;
//   }

//   private setScale(scale: pdfViewerScaleValues) {
//     this._pdfViewer!.currentScaleValue = scale;
//   }
// }

// export type EventBusEvents = 'pagesloaded' | 'pagerendered' | 'pagesinit';
// export type pdfViewerScaleValues =
//   | 'page-width'
//   | 'page-height'
//   | 'page-fit'
//   | 'page-actual';
