import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { FileService } from 'src/app/services/file.service';
import { FileService } from '../../domain/service/file.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements OnInit, AfterViewChecked {
  @Input() imageFile!: string
  @ViewChild('image', { static: false }) imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('modalDialog', { static: false }) modalDialog!: ElementRef<HTMLDivElement>;
  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef<HTMLDivElement>;

  private imageLoaded = false;

  imgURL: any;


  constructor(private  bsModalRef: BsModalRef, private _sanitizer: DomSanitizer, private renderer: Renderer2) {}
  ngOnInit(): void {

  }

  ngAfterViewChecked(): void {
    if (this.imgURL != null && this.imageElement && this.modalContent && this.modalDialog && !this.imageLoaded) {
      const img = this.imageElement.nativeElement;
      this.renderer.listen(img, 'load', () => {
        // this.adjustModalSize(img);
        this.imageLoaded = true;
      });
    }
  }

  private adjustModalSize(img: HTMLImageElement): void {
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const maxWidth = screenWidth * 0.8; // Maksimal 80% dari lebar layar
    const maxHeight = screenHeight * 0.8; // Maksimal 80% dari tinggi layar

    let width = imgWidth;
    let height = imgHeight;
    console.log('adjustModalSize: ', width, height)

    if (imgWidth > maxWidth || imgHeight > maxHeight) {
      const widthRatio = maxWidth / imgWidth;
      const heightRatio = maxHeight / imgHeight;
      const ratio = Math.min(widthRatio, heightRatio);
      width = imgWidth * ratio;
      height = imgHeight * ratio;
    }

    this.renderer.setStyle(this.modalContent.nativeElement, 'width', `${width}px`);
    this.renderer.setStyle(this.modalContent.nativeElement, 'height', `${height}px`);
    this.centerModal();
  }

  private centerModal(): void {
    const modalDialog = this.modalDialog.nativeElement;
    const dialogWidth = modalDialog.offsetWidth;
    const dialogHeight = modalDialog.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const top = (screenHeight - dialogHeight) / 2;
    const left = (screenWidth - dialogWidth) / 2;
    console.log(`screenHeight: ${screenHeight}, dialogHeight: ${dialogHeight}, screenWidth: ${screenWidth}, dialogWidth: ${dialogWidth}`)
    console.log('center modal', `top: ${top}px`, `left: ${left}px`)
    this.renderer.setStyle(modalDialog, 'top', `${top}px`);
    this.renderer.setStyle(modalDialog, 'left', `${left}px`);
    this.renderer.setStyle(modalDialog, 'position', 'absolute');
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.imageElement && this.imageLoaded) {
      const img = this.imageElement.nativeElement;
      // this.adjustModalSize(img);
    }
  }
}
