import * as pdfjs from 'pdfjs-dist';
import { TypedArray } from 'pdfjs-dist/types/src/display/api';
import { PDFLinkService } from 'pdfjs-dist/web/pdf_viewer';
import { InternalPdfViewer } from '../types/internal-pdf-viewer';
import { ICanvasPosition } from '../types/ICanvasPosition';

declare module '../types/internal-pdf-viewer' {
	interface InternalPdfViewer {
		processFile: (this: InternalPdfViewer, file: File) => Promise<InternalPdfViewer>;
	}
}

declare module '../types/ICanvasPosition' {
	interface ICanvasPosition {
		getOffsetDifference: (
			this: ICanvasPosition,
			newPosition: ICanvasPosition
		) => ICanvasPosition;
	}
}

ICanvasPosition.prototype.getOffsetDifference = function (
	newPosition: ICanvasPosition
): ICanvasPosition {
	const x = newPosition.x - this.x;
	const y = newPosition.y - this.y;
	return new ICanvasPosition(x, y);
};

InternalPdfViewer.prototype.processFile = async function (
	file: File
): Promise<InternalPdfViewer> {
	const fileBuffer = await file.arrayBuffer();
	const fileRef = await pdfjs.getDocument(fileBuffer as TypedArray).promise;
	this.setDocument(fileRef);
	(this.linkService as PDFLinkService).setDocument(fileRef);
	return this;
};

export class Extensions {}
