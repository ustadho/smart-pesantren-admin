import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import { SubmitButtonComponent } from '../../../components/submit-button/submit-button.component';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { ClassRoomService } from '../../../domain/service/class-room.service';
import { SubjectService } from '../../../domain/service/subject.service';
import { InstitutionService } from '../../../domain/service/institution.service';
import { KBMAssesmentService } from '../../../domain/service/kbm-assesment.service';
import { AssesmentEditComponent } from './assesment-edit/assesment-edit.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SettingPenilaianService } from '../../../domain/service/setting-penilaian.service';

@Component({
  selector: 'app-assesment',
  standalone: true,
  imports: [
    BaseInputComponent,
    ReactiveFormsModule,
    CommonModule,
    SubmitButtonComponent,
  ],
  providers: [BsModalService],
  templateUrl: './assesment.component.html',
  styleUrl: './assesment.component.scss'
})
export class AssesmentComponent {
  private fb = inject(FormBuilder);
  private academicYearService = inject(AcademicYearService);
  private classRoomService = inject(ClassRoomService);
  private subjectService = inject(SubjectService);
  private institutionService = inject(InstitutionService);
  private kbmAssesmentService = inject(KBMAssesmentService);
  private settingPenilaianService = inject(SettingPenilaianService);
  private modalService = inject(BsModalService);
  private settingPenilaian: any;

  form!: FormGroup;
  institutions: any[] = [];
  academicYears: any[] = [];
  semesters: any[] = [
    { id: 1, name: 'Semester 1' },
    { id: 2, name: 'Semester 2' },
  ];
  classRooms: any[] = [];
  subjects: any[] = [];
  students: any[] = [];
  modalRef?: BsModalRef;
  
  ngOnInit(): void {
    this.form = this.fb.group({
      institutionId: [null, [Validators.required]],
      academicYearId: [null, [Validators.required]],
      semester: [null, [Validators.required]],
      classRoomId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
    })
    this.subjectService.findAll('').subscribe((data) => {
      this.subjects = data.body;
    })

    this.institutionService.findAll('').subscribe((data) => {
      this.institutions = data.body;
    })

    const today = new Date();
    if (today.getMonth() >= 6 && today.getMonth() <= 11) {
      this.form.get('semester')?.setValue(1);
    } else {
      this.form.get('semester')?.setValue(2);
    }

    this.academicYearService.findAll('').subscribe((data) => {
      this.academicYears = data.body;
      this.academicYears.map((item: any) => {
        if (item.isDefault == true) {
          this.form.get('academicYearId')?.setValue(item.id);
          this.loadClassRoom(item);
        }
      })
    })
  }

  async loadClassRoom(event: any) {
    if (event == null || this.form.get('institutionId')?.value == null || this.form.get('academicYearId')?.value == null) {
      return;
    }
    console.log(event);
    this.form.get('classRoomId')?.setValue(null);
    this.classRooms = [];
    this.classRoomService.findByAcademicYear(this.form.get('institutionId')?.value, this.form.get('academicYearId')?.value).subscribe((data) => {
      this.classRooms = data.body;
    })
  }

  loadStudent(event: any) {
    this.students = [];
    if (event == null || this.form.get('classRoomId')?.value == null || this.form.get('semester')?.value == null || this.form.get('subjectId')?.value == null) {
      return;
    }
    this.kbmAssesmentService.findStudentByClassRoomId({
      classRoomId: this.form.get('classRoomId')?.value,
      semester: this.form.get('semester')?.value,
      subjectId: this.form.get('subjectId')?.value,
    }).subscribe((data) => {
      this.students = data.body;
    })
  }

  loadSettingPenilaian(event: any) {
    if (event == null || this.form.get('institutionId')?.value == null) {
      return;
    }
    this.settingPenilaianService.getSettingPenilaian(this.form.get('institutionId')?.value).subscribe((data) => {
      this.settingPenilaian = data;
      console.log('settingPenilaian', this.settingPenilaian);
    })
  }

  onSelectRow(student: any) {
    console.log(student);
    const initialState: ModalOptions = {
        initialState: {
          data: {
            academicYearId: this.form.get('academicYearId')?.value,
            academicYearName: this.academicYears.find(e=>e.id == this.form.get('academicYearId')?.value)?.name,
            semester: this.form.get('semester')?.value,
            subjectId: this.form.get('subjectId')?.value,
            subjectName: this.subjects.find(e=>e.id == this.form.get('subjectId')?.value)?.name,
            classRoomId: this.form.get('classRoomId')?.value,
            classRoomName: this.classRooms.find(e=>e.id == this.form.get('classRoomId')?.value)?.name,
            ...student
          },
          settingPenilaian: this.settingPenilaian
        },
      };

      this.modalRef = this.modalService.show(
        AssesmentEditComponent,
        initialState
      );
      this.modalRef.setClass('modal-md');
      this.modalRef.content.closeBtnName = 'Close';
      this.modalRef.content.onClose.subscribe((response: any) => {
        if(response == 'success'){
          this.loadStudent(this.form.get('subjectId')?.value);
        }
      });
  }
}
