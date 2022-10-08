export const SIGN_INIT_POSITION = {
  x: 120,
  y: 1000,
  w: 200,
  h: 200,
};

let _isPc: boolean | undefined;
export const isPc = () => {
  if (_isPc == undefined) _isPc = getIsPc();
  return _isPc;
};

const getIsPc = (): boolean => {
  const mobileAgents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPod',
    'iPad',
    'BlackBerry',
    'Opera Mini',
    'IEMobile',
    'webOS',
  ];
  const isMobile = mobileAgents.some(
    (item) => navigator.userAgent.indexOf(item) > 0
  );
  return !isMobile;
};

const MOUSE_EVENT = {
  start: 'touchstart',
  move: 'touchmove',
  end: 'touchend',
};

const PC_EVENT = {
  pc_start: 'mousedown',
  pc_move: 'mousemove',
  pc_end: 'mouseup',
};

type GET_KEYS<T> = keyof T;
type EVENT_KEYS = keyof typeof MOUSE_EVENT | keyof typeof PC_EVENT;
const EVENTS = {
  ...MOUSE_EVENT,
  ...PC_EVENT,
};

export const GET_EVENT = (key: GET_KEYS<typeof MOUSE_EVENT>) => {
  const _key = isPc() ? `pc_${key}` : key;
  return EVENTS[_key as EVENT_KEYS];
};

export const MIME_TYPES = {
  png: 'image/png',
};

export const PWD = 1010;

export const RECT_TOOL_SIZE = 100;

export const DEFAULT_SCALE_VALUE = 'page-width';
