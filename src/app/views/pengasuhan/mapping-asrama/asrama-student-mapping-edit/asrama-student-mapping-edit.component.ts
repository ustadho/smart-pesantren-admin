import { Component, inject, Input, signal } from '@angular/core';
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
import { ITab } from 'src/app/domain/model/tab.model';

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
  @Input() academicYears: any[] = [];
  @Input() pesantrens: any[] = [];
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
      locationId: [null],
      academicYearId: [null],
      asramaId: [null],
      musyrifId: [null],
      students: this.fb.array([]),
    });

    this.asramaService.findAll({
      locationId: '',
      q: '',
    }).subscribe((data) => {
      this.asramas = data.body;
    })
    this.academicYears.map((item: any) => {
      if (item.isDefault == true) {
        this.form.get('academicYearId')?.setValue(item.id);
      }
    });
    this.employeeService.findAll('').subscribe((data) => {
      this.employees = data.body;
    });
    setTimeout(async ()=> {
      if(this.activeTab?.data != null) {
        console.log('this.activeTab.data', this.activeTab.data)
        this.form.patchValue(this.activeTab.data)
        const students = this.form.get('students') as FormArray;
        students.clear();
        this.activeTab.data.students.forEach((s: any) => {
          students.push(this.fb.group(s));
        });
        this.selectedAsrama = await this.asramas.find((x: any) => x.id == this.form.get('asramaId')?.value);
        // console.log('selectedAsrama', this.selectedAsrama)
        this.onSelectAsrama(this.selectedAsrama);
      }
    }, 500)
  }

  onSelectAsrama(e: any) {
    this.selectedAsrama = e;
    this.musyrifs = this.employees.filter((x: any) => x.sex == e.sex);
    // if(this.form.get('id')?.value == null) {
    //   this.loadStudent();
    // }
  }

  onSave() {
    this.isSubmitting.set(true);
    this.asramaMappingService
      .save(this.form.getRawValue())
      .subscribe((data: any) => {
        console.log('success');
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
            nis: el.nis,
            nisn: el.nisn,
            name: el.name,
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
    if(this.activeTab == null || this.activeTab.data == null) {
      return
    }
  }

  onDeleteStudent(a: any) {
    Swal.fire({
      title: 'Hapus data',
      text: `Anda yakin untuk menghapus ' ${a.name} - ${a.nis}'?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya Benar',
    }).then((result) => {
      if (result.value) {
        // this.classRoomStudentService.deleteById(a.id).subscribe((response) => {
        //   if (this.form.getRawValue().id != null) {
        //     this.toast.success('Hapus data sukses');
        //     this.loadStudent()
        //   }
        // });
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
