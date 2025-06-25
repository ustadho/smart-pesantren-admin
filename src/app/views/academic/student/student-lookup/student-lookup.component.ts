import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { combineLatest, Subject } from 'rxjs';
import { StudentService } from '../../../../domain/service/student.service';
import { SORT } from '../../../../shared/constant/navigation.constants';
import { ITEMS_PER_PAGE } from '../../../../shared/constant/pagination.constants';
import { SortByDirective, SortDirective, SortService, SortState, sortStateSignal } from '../../../../shared/directive/sort';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { ClassRoomService } from '../../../../domain/service/class-room.service';

@Component({
  selector: 'app-student-lookup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PaginationModule,
    SortDirective,
    SortByDirective,
    FontAwesomeModule,
    NgSelectComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './student-lookup.component.html',
  styleUrl: './student-lookup.component.scss'
})
export class StudentLookupComponent {
  public institutions: any[] = [];
  public academicYears: any[] =[];
  public totalItems: number = 0;
  public page: any;
  public previousPage: any;
  public itemsPerPage = ITEMS_PER_PAGE;
  public predicate: any;
  public data: any[] = [];
  public classRooms: any[] = [];
  public selectedStudents: any[] = []; // Array to store selected students
  form: any;
  param: any; //dikirim dari form yang memanggil
  public onClose: Subject<Object> = new Subject();
  isSubmitting = signal(false);

  isLoading = signal(false);
  sortState = sortStateSignal({});

  private fb = inject(FormBuilder);
  private service = inject(StudentService);
  private classRoomService = inject(ClassRoomService);
  private activatedRoute = inject(ActivatedRoute);
  private sortService = inject(SortService);
  public modalRef = inject(BsModalRef);

  ngOnInit(): void {
    this.form = this.fb.group({
      q: [null],
      academicYearId: [null],
      institutionId: [null],
      classRoomId: [null],
      categoryId: [null],
      selectAll: [false, [Validators.required]],
      items: this.fb.array([])
    })
    this.handleNavigation();
    
    // Load classRooms with proper error handling
    this.isLoading.set(true);
    this.classRoomService.findAll('').subscribe({
      next: (res: any) => {
        this.classRooms = res.body.filter((x: any) => x.sex === this.param?.sex);
        console.log('classRooms', this.classRooms)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading classRooms:', err);
        this.isLoading.set(false);
      }
    });
  }

  public loadAll() {
    this.totalItems = 0;
    this.data = [];
    this.service
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sortService.buildSortParam(this.sortState(), 'name'),
        q: this.form.value.q?? '',
        iid: this.form.value.institutionId?? '',
        y: this.form.value.academicYearId?? '',
        c: this.form.value.categoryId?? '',
        cid: this.form.value.classRoomId?? '',
        sex: this.param?.sex,
      })
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);
          this.onSuccess(res.body, res.headers);
        },
        error: () => this.isLoading.set(false),
      });
  }

  onSuccess(body: any, headers: HttpHeaders) {
    this.totalItems = body.totalElements;
    this.data = body.content;
    if(this.data && this.data.length > 0) {
      // Store current selectedStudents for preservation
      const currentSelectedStudents = [...this.selectedStudents];
      
      // Create a map of selected student IDs for quick lookup
      const selectedStudentMap = new Map();
      currentSelectedStudents.forEach(student => {
        selectedStudentMap.set(student.id, student);
      });
      
      // Get current form array
      const lineItems = <FormArray>this.form.get('items');
      lineItems.clear();
      
      this.data.forEach(d => {
        // Check if this student was previously selected
        const wasSelected = selectedStudentMap.has(d.id);
        
        lineItems.push(this.fb.group({
          selected: wasSelected,
          ...d
        }));
      });
    }
  }

  loadPage(event: PageChangedEvent): void {
    if (event.page !== this.previousPage) {
      this.page = event.page;
      this.previousPage = event.page;
      this.loadAll();
    }
  }

  onRefresh() {
    this.page = 1
    this.loadAll()
  }

  private handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      this.page = +(page ?? 1);
      this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data['defaultSort']));
    });
  }

  onSelectAll() {
    const lineItems = <FormArray>this.form.get('items');
    lineItems.markAsDirty();
    lineItems.markAsTouched();
    lineItems.markAsPending();

    lineItems.controls.forEach((x) => {
      x.get('selected')?.setValue(this.form.get('selectAll').value);
    });
    
    // Update selectedStudents array when select all is toggled
    this.updateSelectedStudents();
  }

  onSelected() {
    const lineItems = <FormArray>this.form.get('items');
    lineItems.markAsDirty();
    lineItems.markAsTouched();
    lineItems.markAsPending();
    
    // Update selectedStudents array when individual selection changes
    this.updateSelectedStudents();
  }
  
  // Method to update the selectedStudents array based on current selections
  updateSelectedStudents() {
    // Create a map of existing selected students for preservation
    const selectedMap = new Map();
    this.selectedStudents.forEach(student => {
      selectedMap.set(student.id, student);
    });
    
    // Get current form items
    const formItems = this.form.getRawValue().items;
    
    // Track which students from the current page are in the form
    const currentPageIds = new Set();
    
    // Add or update selections from the current page
    if (formItems && formItems.length > 0) {
      formItems.forEach((item: any) => {
        currentPageIds.add(item.id);
        
        if (item.selected) {
          // Add to selectedStudents if not already there
          selectedMap.set(item.id, item);
        } else {
          // Remove from selectedStudents if it was previously selected
          selectedMap.delete(item.id);
        }
      });
    }
    
    // Convert the map back to an array
    this.selectedStudents = Array.from(selectedMap.values());
  }

  get getFormDetailControls() {
    const control = this.form.get('items') as FormArray;
    return control;
  }

  trackIdentity(index: number, d: any) {
    return d.id;
  }

  async onNext() {
    this.isSubmitting.set(true);
    this.onClose.next(this.selectedStudents);
    this.modalRef.hide()
    this.isSubmitting.set(false);
  }
  
  // Remove a student from the selected list and uncheck their checkbox
  removeSelectedStudent(student: any) {
    // Find the index of the student in the form array
    const lineItems = <FormArray>this.form.get('items');
    const index = lineItems.controls.findIndex((control) => {
      const value = control.value;
      return value.id === student.id;
    });
    
    if (index !== -1) {
      // Uncheck the checkbox
      lineItems.at(index).get('selected')?.setValue(false);
      
      // Update the selected students array
      this.updateSelectedStudents();
    }
  }
}
