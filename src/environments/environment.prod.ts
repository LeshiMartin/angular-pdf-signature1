export const environment = {
  production: true,
  pdfWorker: (version: any) =>
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`,
  MAX_CANVAS_PIXELS: 5242880,
  USE_ONLY_CSS_ZOOM: true,
  TEXT_LAYER_MODE: 0,
  RENDERER: 'canvas',
};
