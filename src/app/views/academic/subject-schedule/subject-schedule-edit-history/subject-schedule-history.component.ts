import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subject-schedule-history',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './subject-schedule-history.component.html',
  styleUrl: './subject-schedule-history.component.scss'
})
export class SubjectScheduleHistoryComponent {
  form!: FormGroup
  data: any
  className: string = ''
  public onClose: Subject<Object> = new Subject();

  private toastService = inject(ToastrService);
  modalRef = inject(BsModalRef)

  constructor() {

  }

  ngOnInit() {

  }
}
