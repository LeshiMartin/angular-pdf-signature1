import { PDFPage, PDFDocument } from 'pdf-lib';

export class Stack<T> {
	constructor(collection?: T[] | null) {
		if (collection == null) return;
		this._isEmpty = false;
		this._collection = [...collection];
		this._count = collection.length;
	}
	private _collection: T[] = [];
	private _count = 0;
	private _isEmpty = true;
	pop(): T | undefined {
		if (this._isEmpty) return undefined;
		const item = this._collection.pop();
		this._isEmpty = this._collection.length == 0;
		this._count--;
		return item;
	}
	count = () => this._count;
	insert(val: T): number {
		this._collection.push(val);
		this._count++;
		this._isEmpty = false;
		return this._count;
	}

	viewLast = () =>
		this._isEmpty ? undefined : this._collection[this._collection.length - 1];
}

export class PdfPageMetadata {
	constructor(public id: number, page: PDFPage) {
		this.history = new Stack<PDFPage>([page]);
		this._curentPage = page;
	}
	private _curentPage!: PDFPage;
	private history: Stack<PDFPage>;
	pageModified = (page: PDFPage) => {
		this.history.insert(this._curentPage);
		this._curentPage = page;
		return page;
	};

	undoModification(): PDFPage {
		if (this.history.count() == 1) return this._curentPage;
		const page = this.history.pop()!;
		this._curentPage = page;
		return page;
	}

	hasHisory = () => this.history.count() > 1;

	page = () => this._curentPage;

	getCopy = async (pdfDoc: PDFDocument) => (await pdfDoc?.copyPages(pdfDoc, [0, 0]))![0];
}
