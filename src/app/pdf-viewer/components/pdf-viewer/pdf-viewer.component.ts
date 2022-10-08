import { PdfViewerService } from '../../services/pdf-viewer.service';
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
@Component({
	selector: 'app-pdf-viewer',
	templateUrl: './pdf-viewer.component.html',
	styleUrls: ['./pdf-viewer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewerComponent implements OnInit {
	private _file: File | undefined;
	@Input()
	public get file(): File | undefined {
		return this._file;
	}
	public set file(v: File | undefined) {
		this._file = v;
		if (!v) return;
		this.onFileChange(v).then();
	}
	@Output() pdfViewerChange = new EventEmitter<PDFViewer>();
	pdfReady = false;
	pdfFile: any;

	@ViewChild('containerRef', { static: true }) containerRef!: ElementRef;
	constructor(private pdfViewerService: PdfViewerService) {}
	pdfViewer: PDFViewer | undefined;

	ngOnInit(): void {}

	async onFileChange(file: File) {
		this.pdfViewer = await this.pdfViewerService
			.getPdfViewer(this.containerRef.nativeElement)
			.processFile(file);
		this.pdfViewerChange.emit(this.pdfViewer);
	}
}
