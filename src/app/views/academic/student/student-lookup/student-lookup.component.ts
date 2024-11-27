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
  categories: any[] = [];
  academicYears: any[] =[];
  public totalItems: number = 0;
  public page: any;
  public previousPage: any;
  public itemsPerPage = ITEMS_PER_PAGE;
  public predicate: any;
  public data: any[] = [];
  form: any;
  param: any; //dikirim dari form yang memanggil
  public onClose: Subject<Object> = new Subject();
  isSubmitting = signal(false);

  isLoading = signal(false);
  sortState = sortStateSignal({});

  private fb = inject(FormBuilder);
  private service = inject(StudentService);
  private activatedRoute = inject(ActivatedRoute);
  private sortService = inject(SortService);
  public modalRef = inject(BsModalRef);

  ngOnInit(): void {
    this.form = this.fb.group({
      q: [null],
      academicYearId: [null],
      categoryId: [null],
      selectAll: [true, [Validators.required]],
      items: this.fb.array([])
    })
    this.handleNavigation();
  }

  public loadAll() {
    this.service
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sortService.buildSortParam(this.sortState(), 'name'),
        q: this.form.value.q?? '',
        iid: this.param?.institutionId,
        y: this.form.value.academicYearId?? '',
        c: this.form.value.categoryId?? '',
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
      const lineItems = <FormArray>this.form.get('items');
      lineItems.clear();

      this.data.forEach(d => {
        lineItems.push(this.fb.group({
          selected: false,
          ...d
        }))
      })
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
  }

  onSelected() {
    const lineItems = <FormArray>this.form.get('items');
    lineItems.markAsDirty();
    lineItems.markAsTouched();
    lineItems.markAsPending();
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
    let items: any[] = []
    await this.form.getRawValue().items.forEach((x: any) => {
      if(x.selected) {
        items.push(x)
      }
    })
    this.onClose.next(items);
    this.modalRef.hide()
    this.isSubmitting.set(false);
  }
}
