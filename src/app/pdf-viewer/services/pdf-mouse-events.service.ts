import { Injectable } from '@angular/core';
import {
  concatMap,
  merge,
  mergeMap,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { GET_EVENT } from '../types/constants';
import { ICanvasPosition } from '../types/ICanvasPosition';
import { ISignPosition } from '../types/ISignPosition';
import { CanvasHelper } from './CanvasHelper';
import { Utilities } from './utilities';

export class TrackCanvas {
  private _currentCanvas: HTMLCanvasElement | undefined;
  public get currentCanvas(): HTMLCanvasElement | undefined {
    return this._currentCanvas;
  }
  public set currentCanvas(v: HTMLCanvasElement | undefined) {
    this._currentCanvas = v;
    this.onCanvasChange.next();
  }

  private _signList: ISignPosition[] = [];
  public get signList(): ISignPosition[] {
    return this._signList;
  }
  public set signList(v: ISignPosition[]) {
    this._signList = v;
    this.onSignListChange.next();
  }
  private _pdfDisplay: HTMLDivElement | undefined;

  touchStartEvent: any;
  touchMoveEvent: any;
  touchEndEvent: any;
  isMoving = false;
  signPositions: ISignPosition[] = [];
  selectSign: ISignPosition | undefined = {} as ISignPosition;
  newOffset: ICanvasPosition = {} as ICanvasPosition;
  oldOffset: ICanvasPosition = {} as ICanvasPosition;
  signMove = false;

  private onUntrack = new Subject<void>();
  private onCanvasChange = new Subject<void>();
  private onSignListChange = new Subject<void>();

  constructor(
    currentCanvas: HTMLCanvasElement | undefined,
    signList: ISignPosition[],
    pdfDisplay: HTMLDivElement | undefined,
    private scale: number,
    private canvasHelper: CanvasHelper
  ) {
    this.currentCanvas = currentCanvas;
    this.signList = signList;
    this._pdfDisplay = pdfDisplay;
  }

  touchStart(event: any, canvas: HTMLCanvasElement, scale: number) {
    this.signPositions = this.canvasHelper.getSignPosition(
      canvas,
      this.signPositions
    );
    const canvasContext = canvas.getContext('2d');
    if (!this.signPositions.length || !canvasContext) return;
    const touchPosition = this.canvasHelper.getTouchPosition(event, scale);
    const curImage = this.canvasHelper.getPointInImage(
      touchPosition,
      this.signPositions
    );
    if (!!curImage.id) {
      this.isMoving = true;
      this.selectSign = curImage;
    }
    if (this.isMoving) {
      this.canvasHelper.clearSignTool(
        curImage,
        this.signPositions,
        this.updateSignList
      );
      this.newOffset = this.oldOffset = new ICanvasPosition(
        touchPosition.x,
        touchPosition.y
      );
      return;
    }

    this.canvasHelper.clearSignToolPosition(this.signPositions);
    this.selectSign = undefined;
  }

  touchMove(event: any, canvas: HTMLCanvasElement, scale: number) {
    if (!this.isMoving) return;
    event.prevetDefault();
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) return;
    this.newOffset = this.canvasHelper.getTouchPosition(event, scale);
    const currentOffset = this.newOffset.getOffsetDifference(this.oldOffset);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.beginPath();
    this.canvasHelper.drawMoveCanvas(
      canvasContext,
      this.signPositions,
      this.selectSign!,
      currentOffset,
      this.isMoving
    );
  }

  touchEnd(canvas: HTMLCanvasElement) {
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) return;
    if (this.isMoving) return;
    const currentOffset = this.newOffset.getOffsetDifference(this.oldOffset);

    const newList = this.canvasHelper.drawMoveCanvas(
      canvasContext,
      this.signPositions,
      this.selectSign!,
      currentOffset,
      false
    );
    this.UnTrack();
    this.updateSignList(newList);
    this.isMoving = false;
  }

  updateSignList = (signList: ISignPosition[]) => {
    this.signPositions = [...signList];
  };

  Track() {
    this.getEffect().subscribe((x) => {
      if (!this._pdfDisplay) return;
      this.canvasAddClick();
      this._pdfDisplay.addEventListener('click', this.pdfHandleClick);
    });
  }

  UnTrack() {
    this.onUntrack.next();
    this.onUntrack.complete();
    this.canvasRemoveClick();
    if (this._pdfDisplay)
      this._pdfDisplay.removeEventListener('click', this.pdfHandleClick);
    //this.ev('')
  }

  private getEffect() {
    this.onUntrack = new Subject();
    return merge(this.onCanvasChange, this.onSignListChange).pipe(
      takeUntil(this.onUntrack)
    );
  }

  private pdfHandleClick(event: any) {
    if (this.signMove) return;
    const canvas = event.target as HTMLCanvasElement;
    if (!canvas || !canvas.getContext) return;
    if (canvas.getAttribute('aria-label')) {
      return;
    }

    const children = this._pdfDisplay!.children as unknown as Element[];
    children.forEach((child: Element) => {
      child.className = 'page';
    });

    (canvas.parentNode!.parentNode as HTMLElement)!['className'] =
      'page active';
    this._currentCanvas = canvas;
    const newSignList = this.canvasHelper.clearSignToolPosition(
      this.signPositions
    );
    this.updateSignList([...newSignList]);
  }

  private canvasAddClick() {
    if (this._currentCanvas) return;
    this.touchStartEvent = (e: any) => {
      this.signMove = true;
      this.touchStart(e, this._currentCanvas!, this.scale);
    };

    this.touchEndEvent = (e: any) => {
      this.touchEnd(this._currentCanvas!);
      setTimeout(() => {
        this.signMove = false;
      }, 100);
    };

    this.touchMoveEvent = (e: any) =>
      this.touchMove(e, this._currentCanvas!, this.scale);

    this._currentCanvas!.addEventListener(
      GET_EVENT('start'),
      this.touchStartEvent,
      true
    );
    this._currentCanvas!.addEventListener(
      GET_EVENT('move'),
      this.touchStartEvent,
      true
    );
    this._currentCanvas!.addEventListener(
      GET_EVENT('end'),
      this.touchStartEvent,
      true
    );
  }

  private canvasRemoveClick() {
    if (!this.touchStartEvent) return;
    this._currentCanvas!.removeEventListener(
      GET_EVENT('start'),
      this.touchStartEvent,
      true
    );
    this._currentCanvas!.removeEventListener(
      GET_EVENT('move'),
      this.touchStartEvent,
      true
    );
    this._currentCanvas!.removeEventListener(
      GET_EVENT('end'),
      this.touchStartEvent,
      true
    );
  }
}
