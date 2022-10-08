export class ISignPosition {
  constructor(init?: Partial<ISignPosition>) {
    Object.assign(this, init);
  }
  id!: string;
  x!: number;
  y!: number;
  w!: number;
  h!: number;
  pdfCanvas!: HTMLCanvasElement;
  signSrc?: string | null;
  image?: HTMLImageElement | null;
  signType!: SignType;
  controlId!: string;
  controlType!: ControlType;
  isSelect?: boolean | null;
  pageIndex?: number | null;
}
type ControlType = 'lt' | 'lc' | 'lb' | 'rt' | 'rc' | 'rb' | 'move';
export type SignType = 'rectTool' | 'image' | 'rectPos';
