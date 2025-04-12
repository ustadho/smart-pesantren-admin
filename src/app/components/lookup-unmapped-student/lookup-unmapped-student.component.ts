import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { SubjectScheduleService } from '../../../app/domain/service/subject-schedule.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lookup-unmapped-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lookup-unmapped-student.component.html',
  styleUrl: './lookup-unmapped-student.component.scss'
})
export class LookupUnmappedStudentComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  sourceForm!: FormGroup;
  data: any
  teacher: any
  className: string = '';
  availableStudents: any[] = [];
  public onClose: Subject<Object> = new Subject();
  isSubmitting = signal(false);

  private toastService = inject(ToastrService);
  private subjectScheduleService = inject(SubjectScheduleService);
  modalRef = inject(BsModalRef)


  constructor(private fb: FormBuilder) { }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.patchValue({
        id: this.data.subjectTeacherScheduleId,
        subjectId: this.data.subjectId,
        subjectName: this.data.subjectName,
        teacherId: this.teacher.id,
      })
    })
  }

  ngOnInit(): void {
    console.log('data', this.data)
    this.form = this.fb.group({
      id: [null],
      subjectId: [(new Date()).getDay()],
      subjectName: [null],
      teacherId: [null],
      selectAll: [true, [Validators.required]],
      students: this.fb.array([]),
      }
    );
    this.sourceForm = this.fb.group({
      selectAll: [false, [Validators.required]],
      students: this.fb.array([]),
    });
    const students = this.sourceForm.get('students') as FormArray;
    this.availableStudents.forEach((s: any) => {
      students.push(this.fb.group({
        ...s,
        selected: false,
      }));
    })
  }

  save() {
  }

  onSelectAllSource() {
    const lineItems = <FormArray>this.sourceForm.get('students');
    lineItems.markAsDirty();
    lineItems.markAsTouched();
    lineItems.markAsPending();

    lineItems.controls.forEach((x) => {
      x.get('selected')?.setValue(this.sourceForm.get('selectAll')?.value);
    });
  }

  get hasSelectedSourceStudent(): boolean {
    return this.getSourceStudentsControl.controls.some(control => control.get('selected')?.value);
  }

  get hasSelectedDestStudent(): boolean {
    return this.getDestStudentsControl.controls.some(control => control.get('selected')?.value);
  }

  onSelectAllDest() {
    const lineItems = <FormArray>this.form.get('students');
    lineItems.markAsDirty();
    lineItems.markAsTouched();
    lineItems.markAsPending();

    lineItems.controls.forEach((x) => {
      x.get('selected')?.setValue(this.form.get('selectAll')?.value);
    });
  }

  moveSelectedToForm() {
    const sourceStudents = this.sourceForm.get('students') as FormArray;
    const targetStudents = this.form.get('students') as FormArray;

    // Ambil semua students yang dipilih
    const selectedStudents = sourceStudents.controls
      .filter(student => student.get('selected')?.value) // Hanya yang selected = true
      .map(student => this.fb.group({ ...student.value, selected: true })); // Buat copy-nya

    // Tambahkan ke form.students
    selectedStudents.forEach(student => targetStudents.push(student));

    // Hapus dari sourceForm.students yang sudah dipindahkan
    this.sourceForm.setControl(
      'students',
      this.fb.array(sourceStudents.controls.filter(student => !student.get('selected')?.value))
    );
  }

  moveSelectedBackToSource() {
    const sourceStudents = this.form.get('students') as FormArray;
    const targetStudents = this.sourceForm.get('students') as FormArray;

    // Ambil semua students yang dipilih
    const selectedStudents = sourceStudents.controls
      .filter(student => student.get('selected')?.value) // Hanya yang selected = true
      .map(student => this.fb.group({ ...student.value, selected: true })); // Buat copy-nya

    selectedStudents.forEach(student => targetStudents.push(student));
    this.form.setControl(
      'students',
      this.fb.array(sourceStudents.controls.filter(student => !student.get('selected')?.value))
    );
  }

  moveBackToSource(index: number) {
    const sourceStudents = this.sourceForm.get('students') as FormArray;
    const targetStudents = this.form.get('students') as FormArray;

    // Ambil student dari form.students
    const studentToMove = targetStudents.at(index);

    // Tambahkan kembali ke sourceForm.students
    sourceStudents.push(this.fb.group({ ...studentToMove.value, selected: false }));

    // Hapus dari form.students
    targetStudents.removeAt(index);
  }

  get getSourceStudentsControl() {
    const control = this.sourceForm.get('students') as FormArray;
    return control;
  }

  get getDestStudentsControl() {
    const control = this.form.get('students') as FormArray;
    return control;
  }
}
