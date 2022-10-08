import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Utilities } from './pdf-viewer/services/utilities';
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import { degrees, PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { DomSanitizer } from '@angular/platform-browser';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { PdfPageMetadata } from './pdf-viewer/types/stack';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	title = 'angular-pdf-signature1';

	constructor(private dialog: MatDialog, private sanitizer: DomSanitizer) {}
	ngOnInit(): void {}
	file: File | undefined;
	pdfViewerRef: PDFViewer | undefined;
	pdfFileData: any;
	pdfSrc: PDFDocument | undefined;
	currentPdfDoc: PDFDocument | undefined;
	currentPageNr = 1;
	pageCount = 0;
	showUndo = false;
	dragItems: DragItem[] = [
		{
			id: 1,
			isDropped: false,
			isDragging: false,
			xPossition: 0,
			yPossition: 0,
			metaSource: '/assets/images/signature-box.png',
		},
	];

	private pdfPages = new Map<number, PdfPageMetadata>();

	async onUpload(ev: Event) {
		this.file = (ev.target as HTMLInputElement).files![0];
		const fileSource = await this.readFileAsync(this.file);
		const newPdfDoc = await this.extractPdfPage(fileSource as ArrayBuffer | string);
		this.renderPdf(newPdfDoc);
	}

	onDragging(dragItem: DragItem) {
		dragItem.isDropped = false;
		dragItem.isDragging = true;
	}

	onDrop(source: CdkDragEnd, dragItem: DragItem) {
		dragItem.isDropped = true;
		dragItem.isDragging = false;
		dragItem.xPossition = source.dropPoint.x;
		dragItem.yPossition = source.dropPoint.y;
	}

	onIframeDrop(ev: any) {
		console.log(ev);
	}

	async saveItem(dragItem: DragItem) {
		const currentPageMetaData = this.pdfPages.get(this.currentPageNr);
		const copyPage = (await currentPageMetaData?.getCopy(this.currentPdfDoc!))!;
console.log(

	copyPage.getPosition()
);

		const { width: pageWidth, height: pageHeight } = copyPage?.getSize()!;
		this.currentPdfDoc?.removePage(0);
		const pngImageBytes = await fetch(dragItem.metaSource! as string).then((res) =>
			res.arrayBuffer()
		);
		const pngImage = await this.currentPdfDoc!.embedPng(pngImageBytes);
		const pngDims = pngImage!.scale(0.7);
		this.currentPdfDoc?.addPage(copyPage);
		const xPos = this.getXPosition(pageWidth, dragItem.xPossition);
		const yPos = this.getYPosition(pageHeight, dragItem.yPossition);
		copyPage.drawImage(pngImage, {
			height: pngDims.height,
			width: pngDims.width,
			x: xPos-50,
			y: yPos,
		});
		currentPageMetaData?.pageModified(copyPage);
		this.renderFromSrc().then();
		this.showUndo = currentPageMetaData?.hasHisory()!;
	}

	private getXPosition = (pageWidth: number, currentXPosition: number) =>
		(pageWidth * currentXPosition) / window.innerWidth;
	private getYPosition = (pageHeight: number, currentYPosition: number) =>
		(pageHeight * currentYPosition) / window.innerHeight;

	private readFileAsync(file: File): Promise<string | ArrayBuffer | null> {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = reject;
			reader.readAsArrayBuffer(file);
		});
	}

	private setPdfFileData = (fileData: any) =>
		(this.pdfFileData = this.sanitizer.bypassSecurityTrustResourceUrl(fileData));

	private renderPdf(uint8array: BlobPart) {
		const tempblob = new Blob([uint8array], {
			type: 'application/pdf',
		});
		const docUrl = URL.createObjectURL(tempblob);
		this.setPdfFileData(docUrl);
	}

	async undo() {
		const pageMetadata = await this.getPage(this.currentPageNr);
		pageMetadata.undoModification();
		await this.setPage(pageMetadata, this.currentPdfDoc!);
		await this.renderFromSrc();
	}

	nextPage = async () => {
		this.currentPageNr++;
		const page = await this.getPage(this.currentPageNr);
		await this.setPage(page, this.currentPdfDoc!);
		await this.renderFromSrc();
	};

	prevPage = async () => {
		this.currentPageNr--;
		const page = await this.getPage(this.currentPageNr);
		await this.setPage(page, this.currentPdfDoc!);
		await this.renderFromSrc();
	};

	private async renderFromSrc() {
		const pdf = await this.currentPdfDoc?.save();
		this.renderPdf(pdf!);
	}

	private async extractPdfPage(arrayBuff: ArrayBuffer | string) {
		this.pdfSrc = await PDFDocument.load(arrayBuff);
		this.currentPdfDoc = await PDFDocument.create();
		this.currentPageNr = 1;
		this.pageCount = this.pdfSrc.getPageCount();
		await this.setCopiedPages(this.copyPages);
		const metaData = await this.getPage(this.currentPageNr);
		await this.setPage(metaData, this.currentPdfDoc!);
		const newpdf = await this.currentPdfDoc.save();
		return newpdf;
	}

	private getPage = (pageNumber: number): PdfPageMetadata => {
		if (this.pdfPages.has(pageNumber)) return this.pdfPages.get(pageNumber)!;
		throw new Error('Page not set in store');
	};

	private async copyPages(ctx: AppComponent) {
		return await ctx.currentPdfDoc!.copyPages(
			ctx.pdfSrc!,
			Enumerable.Range(0, ctx.pageCount)
		);
	}
	private setCopiedPages = async (copyPages: (ctx: AppComponent) => Promise<PDFPage[]>) =>
		(await copyPages(this)).forEach((p, i) =>
			this.pdfPages.set(i + 1, new PdfPageMetadata(i + 1, p))
		);
	private async setPage(pageMetadata: PdfPageMetadata, currentDoc: PDFDocument) {
		if (currentDoc.getPageCount() > 0) currentDoc.removePage(0);
		currentDoc.addPage(pageMetadata.page());
		this.pdfPages.set(pageMetadata.id, pageMetadata);
		this.showUndo = pageMetadata.hasHisory();
	}
}
export type DragItem = {
	id: number;
	isDropped: boolean;
	isDragging: boolean;
	xPossition: number;
	yPossition: number;
	metaSource?: DragItemMetaSource | undefined;
};

export type DragItemMetaSource = string | ArrayBuffer;

export class Enumerable {
	static Range(start: number, end: number): number[] {
		let returnArr = [];
		for (let index = start; index < end; index++) {
			returnArr.push(index);
		}
		return returnArr;
	}
}
