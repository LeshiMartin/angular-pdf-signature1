import { Component, ViewChild } from '@angular/core';
import { PdfViewerService } from './pdf-viewer/services/pdf-viewer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  pdfReady = false;
  title = 'angular-pdf-signature1';
  pdfFile: any;

  @ViewChild('containerRef', { static: true }) containerRef: any;

  constructor(private pdfViewerService: PdfViewerService) {}

  async onUpload(ev: Event) {
    const file = (ev.target as HTMLInputElement).files![0];
    const pdfViewer = this.pdfViewerService.getPdfViewer(
      this.containerRef.nativeElement
    );
    await this.pdfViewerService.processFile(file, pdfViewer);
  }
}
