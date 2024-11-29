import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { ImagePreviewComponent } from './image-preview.component';
import { FileService } from '../../domain/service/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal-photo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [BsModalService],
  templateUrl: './personal-photo.component.html',
  styleUrl: './personal-photo.component.scss',
})
export class PersonalPhotoComponent {
  @Input() form!: FormGroup;
  @Input() personId: string = '';
  @Input() photoUrl: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  documentName = '';
  files: any[] = [];
  progress = 0;
  imageSrc: string | ArrayBuffer | null = null;
  imgURL: any = '../../../../../assets/images/avatars/no-person-image.png';

  fileService = inject(FileService);
  private _sanitizer = inject(DomSanitizer);
  private bsModalService = inject(BsModalService);
  // private bsModalRef = inject(BsModalRef);

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  ngOnInit(): void {
    if (this.form.get('photo')?.value != null) {
      this.fileService.downloadImage(this.form.get('photo')?.value).subscribe(
        (value) => {
          const mediaType = 'application/image';
          const blob = new Blob([value], { type: mediaType });
          const unsafeImg = URL.createObjectURL(blob);
          this.imgURL = this._sanitizer.bypassSecurityTrustUrl(unsafeImg);
        },
        (error1) => {}
      );
    }
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      const currentFile = event.target.files.item(0);

      if (currentFile != null) {
        const data = {
          description: this.documentName,
          size: file.size,
        };
        this.fileService.upload(data, currentFile).subscribe(
          (res: any) => {
            if (res && res.fileName != null) {
              this.files.push(res);
              this.documentName = '';
              this.form.get('photo')?.setValue(res.fileName);
              this.fileService.downloadImage(res.fileName).subscribe(
                (value) => {
                  const mediaType = 'application/image';
                  const blob = new Blob([value], { type: mediaType });
                  const unsafeImg = URL.createObjectURL(blob);
                  this.imgURL =
                    this._sanitizer.bypassSecurityTrustUrl(unsafeImg);
                },
                (error1) => {}
              );
            }
            if (res.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * res.loaded) / res.total);
            } else if (res instanceof HttpResponse) {
              const message = res.body;
              console.log('message', message);
            }
          },
          (err) => {
            this.progress = 0;
            console.log('Could not upload the file!');
          }
        );
      }
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result;
      };
    }
  }

  preview() {
    if(this.form.get('photo')?.value == null) {
      return;
    }
    const imgFileName = this.form.get('photo')?.value
    this.fileService.downloadImage(imgFileName).subscribe(
      (value) => {
        const mediaType = 'application/image';
        const blob = new Blob([value], { type: mediaType });
        const unsafeImg = URL.createObjectURL(blob);
        const imgURL = this._sanitizer.bypassSecurityTrustUrl(unsafeImg);

        const initialState = {
          imgURL,
        };
        const bsModalRef = this.bsModalService.show(ImagePreviewComponent, {
          initialState,
        });
        // bsModalRef.content.closeBtnName = 'Close';
      },
      (error1) => {}
    );
  }
}
