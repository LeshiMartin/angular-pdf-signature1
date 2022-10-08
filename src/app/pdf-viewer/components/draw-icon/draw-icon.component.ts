import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { DrawComponent } from '../draw/draw.component';

@Component({
  selector: 'app-draw-icon',
  templateUrl: './draw-icon.component.html',
  styleUrls: ['./draw-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawIconComponent {
  constructor(private dialog: MatDialog) {}
  openDraw() {
    this.dialog
      .open(DrawComponent, { disableClose: true })
      .afterClosed()
      .pipe(filter((x) => !!x))
      .subscribe((x) => {
        console.log(x);
      });
  }
}
