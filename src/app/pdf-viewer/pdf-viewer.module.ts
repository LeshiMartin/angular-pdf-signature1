import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerService } from './services/pdf-viewer.service';
import { PdfViewerBuilderService } from './services/pdf-viewer-builder.service';
import { CanvasHelper } from './services/CanvasHelper';
import { DrawComponent } from './components/draw/draw.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { DrawIconComponent } from './components/draw-icon/draw-icon.component';
import { PdfServiceModule } from './pdf-services.module';

import './services/extensions';
@NgModule({
  providers: [],
  declarations: [DrawComponent, PdfViewerComponent, DrawIconComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    PdfServiceModule,
    
  ],
  exports: [PdfViewerComponent, DrawIconComponent],
})
export class PdfViewerModule {}
