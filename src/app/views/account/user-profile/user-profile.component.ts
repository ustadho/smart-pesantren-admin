import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../../../core/auth/account.service';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FileService } from '../../../domain/service/file.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
  ],
  providers: [
    BsModalService
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{
  currentAccount: any
  accountService = inject(AccountService);
  fileService = inject(FileService);
  bsModalRef = inject(BsModalRef)
  bsModalService = inject(BsModalService)
  private _sanitizer = inject(DomSanitizer);
  imgURL: any = '../../../../../assets/images/avatars/no-person-image.png';

  constructor() {

  }

  ngOnInit() {
    this.accountService.identity().then(account => {
      this.currentAccount = account;
      if(account.personData.photo != null) {
        this.fileService.downloadImage(account.personData.photo).subscribe(
          (value) => {
            const mediaType = 'application/image';
            const blob = new Blob([value], { type: mediaType });
            const unsafeImg = URL.createObjectURL(blob);
            this.imgURL = this._sanitizer.bypassSecurityTrustUrl(unsafeImg);
          },
          (error1) => {}
        );
      }

    });
  }

  editProfile() {
    alert('Edit profile clicked!');
  }
}
