import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Guid } from '../types/Guid';
import { ICanvasPosition } from '../types/ICanvasPosition';
import { ISignPosition } from '../types/ISignPosition';
import { PdfServiceModule } from '../pdf-services.module';
import { isPc } from '../types/constants';

@Injectable({
  providedIn: PdfServiceModule,
})
export class CanvasHelper {
  constructor() {}
  drawMoveCanvas(
    ctx: CanvasRenderingContext2D,
    signList: ISignPosition[],
    selectSign: ISignPosition,
    diffOffset: ICanvasPosition,
    isMoving: boolean
  ) {
    const newImage = this.getImageOffset(selectSign, signList, diffOffset);
    const newSignToolList = this.getSignToolPositon(newImage);
    const newImageSignList = signList.map((sign) => {
      if (sign.id === newImage.id) {
        return newImage;
      }
      return sign;
    });
    const filterSignList = newImageSignList.filter(
      (sign) => sign?.controlId !== newImage.id
    );
    if (!isMoving) return [...filterSignList, ...newSignToolList];
    const newSignList = [...filterSignList, ...newSignToolList];
    newSignList.forEach((signPos) => {
      const { pdfCanvas, image } = signPos;
      if (selectSign.pdfCanvas === pdfCanvas) {
        if (image) {
          this.drawImage(ctx, signPos);
        } else {
          this.drawRect(ctx, signPos);
        }
      }
    });
    return newSignList;
  }

  getSignPosition(
    canvas: HTMLCanvasElement,
    signList: ISignPosition[]
  ): ISignPosition[] {
    let signPositions = [] as ISignPosition[];
    signList.forEach((item) => {
      if (item.pdfCanvas === canvas) {
        signPositions.push(item);
      }
    });
    return signPositions;
  }
  getTouchPosition(e: any, scale: number): ICanvasPosition {
    const event = this.getEvent(e);
    const target = event.target;
    const rect = target.getBoundingClientRect();
    const x = event.pageX - rect.left;
    const y = event.pageY - rect.top;
    return new ICanvasPosition(x / scale, y / scale);
  }

  getEvent = (e: any) => {
    return isPc() ? e : e.targetTouches[0];
  };

  getPointInImage = (
    touchPosition: ICanvasPosition,
    signPositions: ISignPosition[]
  ) => {
    let signImage = {} as ISignPosition;
    signPositions.forEach((signPos: ISignPosition) => {
      const { x, y, w, h } = signPos;
      const startX = x;
      const endX = x + w;
      const startY = y;
      const endY = y + h;
      const tx = touchPosition.x;
      const ty = touchPosition.y;
      if (tx < startX || tx > endX || ty < startY || ty > endY) {
        return false;
      }
      signImage = signPos;
      return true;
    });
    return signImage;
  };

  clearSignTool = (
    sign: ISignPosition,
    signList: ISignPosition[],
    updateSignList: (signList: ISignPosition[]) => void
  ) => {
    if (!sign.isSelect && sign.image) {
      const newSignList = this.clearSignToolPosition(signList);
      const toolsPosition = this.getSignToolPositon(sign);
      sign.isSelect = true;
      updateSignList([...newSignList, ...toolsPosition]);
    }
  };

  clearSignToolPosition = (signList: ISignPosition[]) => {
    const newSignList = signList.filter((sign) => {
      sign.isSelect = false;
      const isToolLine = sign.signType === 'rectTool';
      return !isToolLine;
    });
    return newSignList;
  };

  getSignToolPositon = (sign: ISignPosition) => {
    const rect = environment.RECT_TOOL_SIZE;
    const { x, y, id, pdfCanvas, w, h } = sign;
    const lt: ISignPosition = {
      x: x - rect,
      y: y - rect,
      w: rect,
      h: rect,
      signType: 'rectTool',
      id: Guid.newGuid().slice(0, 8),
      controlId: id,
      controlType: 'lt',
      pdfCanvas,
    };
    const lc: ISignPosition = {
      x: x - rect,
      y: y + h / 2 - rect / 2,
      w: rect,
      h: rect,
      signType: 'rectTool',
      id: Guid.newGuid().slice(0, 8),
      controlId: id,
      controlType: 'lc',
      pdfCanvas,
    };
    const lb: ISignPosition = {
      x: x - rect,
      y: y + h,
      w: rect,
      h: rect,
      signType: 'rectTool',
      id: Guid.newGuid().slice(0, 8),
      controlId: id,
      controlType: 'lb',
      pdfCanvas,
    };
    const rt: ISignPosition = {
      x: x + w,
      y: y - rect,
      w: rect,
      h: rect,
      signType: 'rectTool',
      id: Guid.newGuid().slice(0, 8),
      controlId: id,
      controlType: 'rt',
      pdfCanvas,
    };
    const rc: ISignPosition = {
      x: x + w,
      y: y + h / 2 - rect / 2,
      w: rect,
      h: rect,
      signType: 'rectTool',
      id: Guid.newGuid().slice(0, 8),
      controlId: id,
      controlType: 'rc',
      pdfCanvas,
    };
    const rb: ISignPosition = {
      x: x + w,
      y: y + h,
      w: rect,
      h: rect,
      signType: 'rectTool',
      id: Guid.newGuid().slice(0, 8),
      controlId: id,
      controlType: 'rb',
      pdfCanvas,
    };
    return [lt, lc, lb, rt, rc, rb];
  };

  getImageOffset(
    selectSign: ISignPosition,
    signList: ISignPosition[],
    offset: ICanvasPosition
  ) {
    const { controlType, controlId, image } = selectSign;
    if (image) {
      return new ISignPosition({
        ...selectSign,
        x: offset.x + selectSign.x,
        y: offset.y + selectSign.y,
      });
    }
    const imageSign = signList.filter((sign) => sign.id === controlId);
    const { h, w, x, y } = imageSign[0];
    switch (controlType) {
      case 'lt': {
        return {
          ...imageSign[0],
          h: h - offset.y,
          w: w - offset.x,
          x: x + offset.x,
          y: y + offset.y,
        };
      }
      case 'lc': {
        return {
          ...imageSign[0],
          w: w - offset.x,
          x: x + offset.x,
        };
      }
      case 'lb': {
        return {
          ...imageSign[0],
          w: w - offset.x,
          h: h + offset.y,
          x: x + offset.x,
        };
      }
      case 'rt': {
        return {
          ...imageSign[0],
          w: w + offset.x,
          h: h - offset.y,
          y: y + offset.y,
        };
      }
      case 'rc': {
        return {
          ...imageSign[0],
          w: w + offset.x,
        };
      }
      case 'rb': {
        return {
          ...imageSign[0],
          w: w + offset.x,
          h: h + offset.y,
        };
      }
      default: {
        return imageSign[0];
      }
    }
  }

  drawImage = (ctx: CanvasRenderingContext2D, sign: ISignPosition) => {
    const { isSelect, image, w, h } = sign;
    let x = Math.floor(sign.x);
    let y = Math.floor(sign.y);
    if (!image) {
      return;
    }
    if (isSelect) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    if (image.complete) {
      ctx.drawImage(image, x, y, w, h);
    } else {
      // 渲染数据
      image.onload = function () {
        ctx.drawImage(image, x, y, w, h);
      };
    }
  };

  drawRect = (ctx: CanvasRenderingContext2D, sign: ISignPosition) => {
    const { w, h } = sign;
    let x = Math.floor(sign.x);
    let y = Math.floor(sign.y);
    ctx.save();
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.clearRect(x + 1, y + 1, w - 2, h - 2);
    ctx.restore();
  };
}
