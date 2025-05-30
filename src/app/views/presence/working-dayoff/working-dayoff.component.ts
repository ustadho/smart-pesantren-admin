import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { EmployeeCategoryService } from '../../../domain/service/employee-category.service';
import { JobPositionService } from '../../../domain/service/job-position.service';
import { OrganizationService } from '../../../domain/service/organization.service';
import { WorkingDayoffService } from '../../../domain/service/working-dayoff.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { WorkingHourDialogComponent } from 'src/app/components/working-hour-dialog/working-hour-dialog.component';

@Component({
  selector: 'app-working-dayoff',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectComponent,
    FontAwesomeModule,
  ],
  providers: [
    BsModalService
  ],
  templateUrl: './working-dayoff.component.html',
  styleUrl: './working-dayoff.component.scss'
})
export class WorkingDayoffComponent implements AfterViewInit {

  private workingDayOffService = inject(WorkingDayoffService)
  private organizationService = inject(OrganizationService);
  private employeeCategoryService = inject(EmployeeCategoryService);
  private jobPositionService = inject(JobPositionService);

  private toast = inject(ToastrService)
  private fb = inject(FormBuilder)

  isLoading = signal(false);
  filterForm: any
  organizations: any[] = []
  jobPositions: any[] = []
  categories: any[] = []
  data: any[] = []
  attendanceOptions = ["Masuk", "Libur"]
  private bsModalService = inject(BsModalService);
  modalRef?: BsModalRef;

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      q: [null],
      organization: [null],
      jobPosition: [null],
      category: [null],
    })
    this.organizationService.findAll('').subscribe((res: any) => {
      this.organizations = res.body;
    });
    this.jobPositionService.findAll('').subscribe((res: any) => {
      this.jobPositions = res.body;
    });
    this.employeeCategoryService.findAll('').subscribe((res: any) => {
      this.categories = res.body;
    });

  }

  ngAfterViewInit(): void {
    this.loadAll();
  }

  updateAttendance(index: number, employeeId: string, day: number, newValue: string) {
    this.workingDayOffService.update({
      employeeId: employeeId,
      dayId: day,
      newValue: newValue
    }).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.data[index]= res
      },
      error: (err: any) => {
        this.onError(err)
      },
    })
  }

  loadAll() {
    const params = this.filterForm.getRawValue();
    this.workingDayOffService.findAll({
      q: params.q??'',
      organization: params.organization??'',
      jobPosition: params.jobPosition??'',
      category: params.category??'',
    }).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.onSuccess(res.body, res.headers);
      },
      error: (err: any) => {
        this.onError(err)
      },
    });
  }

  updateDefaultWorkingHour(employeeId: string) {
    const initialState: ModalOptions = {
      initialState: {
        employeeId: employeeId,
        title: 'Update Jam Kerja'
      },
    };

    this.modalRef = this.bsModalService.show(
      WorkingHourDialogComponent,
      initialState
    );
    this.modalRef.setClass('modal-lg');

    this.modalRef.content.onClose.subscribe((result: any) => {
      if(result) {
        this.loadAll(); // Reload data after update
      }
    });
  }

  onError(err: any) {
    this.isLoading.set(false)
    this.toast.error(err.error.title);
  }

  onSuccess(body: any, headers: any) {
    this.data = body
  }
}
