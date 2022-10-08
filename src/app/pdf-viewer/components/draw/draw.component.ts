import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import SignaturePad from 'signature_pad';
import { MIME_TYPES } from '../../types/constants';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawComponent implements OnInit {
  constructor(private ref: MatDialogRef<DrawComponent>) {}

  signaturePad!: SignaturePad;
  ngOnInit(): void {
    const canvas = document.getElementById('drawingBoard') as HTMLCanvasElement;
    this.signaturePad = new SignaturePad(canvas);
  }

  async confirm() {
    const data = this.signaturePad.toDataURL(MIME_TYPES.png);
    const imageData = await this.clipData(data);
    this.ref.close(imageData);
  }

  private clipData(source: string): Promise<string> {
    return new Promise((resolve, _) => {
      let image: HTMLImageElement | null = new Image();
      let clipCanvas: HTMLCanvasElement | null =
        document.createElement('canvas');
      const clipCtx = clipCanvas.getContext('2d') as CanvasRenderingContext2D;
      image.src = source;
      image.onload = () => {
        if (image && clipCanvas) {
          {
            clipCtx.drawImage(image, 100, 100, 100, 50, 0, 0, 100, 50);
            resolve(clipCanvas.toDataURL(MIME_TYPES.png));
          }
          clipCanvas = null;
          image = null;
        }
      };
    });
  }
}
