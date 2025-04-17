import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AcademicYearService } from '../../../../domain/service/academic-year.service';
import { AsramaService } from '../../../../domain/service/asrama.service';
import { AsramaMappingService } from '../../../../domain/service/asrama-mapping.service';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { StudentLookupComponent } from '../../../academic/student/student-lookup/student-lookup.component';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../../../domain/service/employee.service';
import { ITab } from '../../../../domain/model/tab.model';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-asrama-student-mapping-edit',
  standalone: true,
  imports: [
    BaseInputComponent,
    ReactiveFormsModule,
    CommonModule,
    SubmitButtonComponent,
  ],
  providers: [BsModalService],
  templateUrl: './asrama-student-mapping-edit.component.html',
  styleUrl: './asrama-student-mapping-edit.component.scss',
})
export class AsramaStudentMappingEditComponent {
  @Input() activeTab?: ITab;
  @Input() academicYears!: any[];
  @Input() pesantrens!: any[];
  @Input() institutions!: any[];
  @Input() tabset!: TabsetComponent;
  @Output() onRemove = new EventEmitter<any>();
  form!: FormGroup;
  asramas: any[] = [];
  employees: any[] = [];
  musyrifs: any[] = [];

  selectedAsrama: any = null;
  isSubmitting = signal(false);

  private fb = inject(FormBuilder);
  private asramaService = inject(AsramaService);
  private employeeService = inject(EmployeeService);
  private asramaMappingService = inject(AsramaMappingService);
  private bsModalService = inject(BsModalService);
  private toast = inject(ToastrService);
  modalRef?: BsModalRef;

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      locationId: [null],
      academicYearId: [null],
      academicYearName: [null],
      asramaId: [null],
      asramaName: [null],
      musyrifId: [null],
      students: this.fb.array([]),
    });

    this.asramaService.findAll({
      locationId: '',
      q: '',
    }).subscribe((data) => {
      this.asramas = data.body;
    })
    this.employeeService.findAll('').subscribe((data) => {
      this.employees = data.body;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(async ()=> {
      if(this.activeTab?.data != null) {
        console.log('this.activeTab.data', this.activeTab.data)
        if(this.activeTab.data != null) {
          this.form.patchValue(this.activeTab.data)
        }
        console.log('this.activeTab.data', this.activeTab.data)
        const students = this.form.get('students') as FormArray;
        students.clear();
        this.activeTab.data.students.forEach((s: any) => {
          students.push(this.fb.group(s));
        });
        this.selectedAsrama = await this.asramas.find((x: any) => x.id == this.form.get('asramaId')?.value);
        this.onSelectAsrama(this.selectedAsrama);
      } else {
        const defaultYear = this.academicYears.find((e: any) => e.isDefault === true);
      if (defaultYear) {
        this.form.get('academicYearId')?.setValue(defaultYear.id);
      }
      }
    }, 800)
  }

  onSelectAsrama(e: any) {
    this.selectedAsrama = e;
    if(e == null) 
      return;
    this.musyrifs = this.employees.filter((x: any) => x.sex == e.sex);
    console.log(e)
    if(e.id != null && this.form.value.academicYearId != null) {
      this.asramaMappingService.findOneByAsramaAndYear(e.id, this.form.value.academicYearId).subscribe((data) => {
        this.form.patchValue(data.body);
        const students = this.form.get('students') as FormArray;
        students.clear();
        data.body.students.forEach((s: any) => {
          students.push(this.fb.group(s));
        });
      });
    }
  }

  onSave() {
    this.isSubmitting.set(true);
    this.asramaMappingService
      .save(this.form.getRawValue())
      .subscribe({
        next: (res) => {
          this.toast.success('Simpan data sukses');
          this.onRemove.emit(this.activeTab);
        },
        error: (err) => {
          console.log('Error:', err);
          this.toast.error(`Gagal menyimpan data<br>${err.error.title}`, '', {
            enableHtml: true
          });
        }
      });
    this.isSubmitting.set(false);
  }

  onStudentLookup() {
    if (this.selectedAsrama == null) {
      return;
    }
    const initialState: ModalOptions = {
      initialState: {
        param: {
          sex: this.selectedAsrama?.sex,
          pesantrenId: '',
        },
        academicYears: this.academicYears,
        institutions: this.institutions,
        title: 'Lookup Santri',
      },
    };

    this.modalRef = this.bsModalService.show(
      StudentLookupComponent,
      initialState
    );
    this.modalRef.setClass('custom-modal-width');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((arr: any) => {
      for (let index = 0; index < arr.length; index++) {
        const details = this.form.get('students') as FormArray;
        const el = arr[index];
        details.push(
          this.fb.group({
            id: null,
            studentId: el.id,
            studentNis: el.nis,
            studentNisn: el.nisn,
            studentName: el.name,
            joinYear: el.joinYear,
          })
        );
      }
    });
  }

  loadClassRoom() {
    this.asramas = [];
    if (
      this.form.value.academicYearId == null ||
      this.form.value.institutionId == null
    ) {
      return;
    }
    this.form.get('classRoomId')?.setValue(null);
    this.asramaService
      .findAllSantri(
        this.form.value.asramaId,
      )
      .subscribe((data) => {
        this.asramas = data.body;
      });
  }

  loadStudent() {
    const students = this.form.get('students') as FormArray;
    students?.clear();
    if(this.form.value.classRoomId == null) {
      return;
    }

    // this.classRoomStudentService
    //   .findByClassRoomId(this.form.value.classRoomId)
    //   .subscribe((data) => {
    //     this.form.patchValue(data.body);
    //     const students = this.form.get('students') as FormArray;
    //     students.clear();
    //     students.clear();
    //     data.body.students.forEach((s: any) => {
    //       students.push(this.fb.group(s));
    //     });
    //   });
  }

  onDelete() {
    console.log('this.activeTab',  this.activeTab)
    if(this.activeTab == null || this.activeTab.data == null) {
      return
    }
    Swal.fire({
      title: 'Hapus data',
      text: `Anda yakin untuk menghapus ' ${this.activeTab.data.asramaName} - ${this.activeTab.data.academicYearName}'?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya Benar',
    }).then((result) => {
      if (result.value) {
        this.asramaMappingService?.delete(this.activeTab?.data?.id).subscribe({
          next: (res) => {
            this.toast.success('Hapus data sukses');
            this.onRemove.emit(this.activeTab);
          },
          error: (e) => {
            this.toast.error('Gagal menghapus data');
          }
        });
      }
    });
  }

  onDeleteStudent(a: any) {
    Swal.fire({
      title: 'Hapus data',
      text: `Anda yakin untuk menghapus ' ${a.studentName} - ${a.studentNis}'?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya Benar',
    }).then((result) => {
      if (result.value) {
        const students = this.form.get('students') as FormArray;
        students.removeAt(a.id);
      }
    });
  }

  get getFormDetailControls() {
    const control = this.form.get('students') as FormArray;
    return control;
  }

  trackIdentity(index: number, d: any) {
    return d.id;
  }
}
