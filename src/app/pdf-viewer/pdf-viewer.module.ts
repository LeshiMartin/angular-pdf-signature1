import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerService } from './services/pdf-viewer.service';
import { PdfViewerBuilderService } from './services/pdf-viewer-builder.service';

@NgModule({
  providers: [PdfViewerService, PdfViewerBuilderService],
  declarations: [],
  imports: [CommonModule],
})
export class PdfViewerModule {}
