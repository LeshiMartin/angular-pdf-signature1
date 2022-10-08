import { SIGN_INIT_POSITION } from '../types/constants';
import { Guid } from '../types/Guid';
import { ISignPosition } from '../types/ISignPosition';
export abstract class Utilities {
  static createImage(source: string) {
    const image = new Image();
    image.crossOrigin = '';
    image.src =
      source.indexOf('http') !== -1 ? source + `?t=${+new Date()}` : source;
    return image;
  }

  static drawInitState = () => {
    return {
      ...SIGN_INIT_POSITION,
      id: Guid.newGuid(),
      signType: 'image',
      controlId: '',
      controlType: 'move',
    } as ISignPosition;
  };
}
