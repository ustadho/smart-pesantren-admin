import { Component, inject, OnInit, Signal } from '@angular/core';
import { WorkingHourService } from '../../domain/service/working-hour.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseInputComponent } from '../base-input/base-input.component';
import { Subject } from 'rxjs';
import { EmployeeService } from '../../domain/service/employee.service';

@Component({
  selector: 'app-working-hour-dialog',
  standalone: true,
  imports: [
    BaseInputComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './working-hour-dialog.component.html',
  styleUrl: './working-hour-dialog.component.scss'
})
export class WorkingHourDialogComponent implements OnInit {
  public workingHours: any[] = [];
  details: any = []
  private workingHourService = inject(WorkingHourService)
  private employeeService = inject(EmployeeService)
  form: FormGroup;
  private fb = inject(FormBuilder);
  public onClose: Subject<Object> = new Subject();
  employeeId: string = ''

  constructor() {
    this.form = this.fb.group({
      workingHourId: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.workingHourService.findAll('').subscribe((res: any) => {
      this.workingHours = res.body;
    });
    this.employeeService.findOne(this.employeeId).subscribe((res: any) => {
      this.form.patchValue({
        workingHourId: res.body?.workingHourId
      })
      setTimeout(() => {
        this.onSelectWorkingTimeChange(this.workingHours.find((e: any) => e.id === res.body?.workingHourId))
      }, 1000);
    })
  }

  onSelectWorkingTimeChange(e: any) {
    if(e != null) {
      this.details = e.details
    }
  }

  // save() {
  //   if (!this.form.valid || !this.employeeId) {
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.workingHourService.updateEmployeeWorkingHour({
  //     employeeId: this.employeeId,
  //     workingHourId: this.form.get('workingHourId')?.value
  //   }).subscribe({
  //     next: (res: any) => {
  //       this.toastr.success('Jam kerja berhasil diupdate');
  //       this.onClose.emit(true);
  //       this.bsModalRef.hide();
  //     },
  //     error: (err: any) => {
  //       this.toastr.error(err.error?.title || 'Gagal mengupdate jam kerja');
  //       this.isLoading = false;
  //     }
  //   });
  // }


}
