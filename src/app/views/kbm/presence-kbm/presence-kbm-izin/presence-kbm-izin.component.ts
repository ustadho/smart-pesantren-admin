import { Component, inject, signal } from '@angular/core';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { FileAttachment } from '../../../../components/file-attachment/file-attachment.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PresenceKBMService } from '../../../../domain/service/presence-kbm.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PresenceStatusService } from '../../../../domain/service/presence-status.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-presence-kbm-izin',
  standalone: true,
  imports: [BaseInputComponent, FileAttachment],
  templateUrl: './presence-kbm-izin.component.html',
  styleUrl: './presence-kbm-izin.component.scss'
})
export class PresenceKbmIzinComponent {
  activityTimeId: any
  classRoomId: any
  form!: FormGroup
  data: any
  rowIndex = -1
  className = ''
  presenceStatuses: any[] = []
  teachers: any[] = []
  isSubmiting = signal(false);
  public onClose: Subject<Object> = new Subject();

  fb = inject(FormBuilder)
  private presenceKBMService = inject(PresenceKBMService);
  private presenceStatusService = inject(PresenceStatusService);
  private toastService = inject(ToastrService);
  modalRef = inject(BsModalRef)

  constructor() {
    this.form = this.fb.group({
      id: [null],
      presenceStatusId: [null, [Validators.required]],
      presenceStatusName: [null, [Validators.required]],
      note: [null],
      attachment: [null],
    })
  }

  ngOnInit() {
    this.presenceStatusService.findAll().subscribe(res => {
      this.presenceStatuses = res.body
    })
    this.form.patchValue({
      id: this.data?.id,
      presenceStatusId: this.data.presenceStatusId,
      presenceStatusName: this.data.presenceStatusName,
      note: this.data?.note,
      attachment: this.data?.attachment,
    })
  }

  onSave() {
    this.onClose.next(this.form.getRawValue());
    this.modalRef.hide()
  }

  onDelete() {
    Swal.fire({
      title: 'Hapus data',
      text: `Anda yakin untuk menghapus data ini?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya Benar',
    }).then((r: any) => {
      if (r.value) {
        this.onClose.next('deleteIzin');
        this.modalRef.hide()
      }
    });
  }

  onPresenceStatusChange(e: any) {
    console.log('onPresenceStatusChange', e)
    this.form.get('presenceStatusName')?.setValue(e?.name)
  }
}
