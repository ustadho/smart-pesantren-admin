import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from '../../../../shared/constant/pagination.constants';
import { SortByDirective, SortDirective, SortService, SortState, sortStateSignal } from '../../../../shared/directive/sort';
import { StudentService } from '../../../../domain/service/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { SORT } from '../../../../shared/constant/navigation.constants';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { InstitutionService } from '../../../../domain/service/institution.service';
import { AcademicYearService } from '../../../../domain/service/academic-year.service';
import { NgSelectComponent } from '@ng-select/ng-select';


@Component({
  selector: 'app-student-list',
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
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  public institutionId = '';
  public totalItems: number = 0;
  public page: any;
  public previousPage: any;
  public itemsPerPage = ITEMS_PER_PAGE;
  public predicate: any;
  public data: any[] = [];
  public categories: any[] = [];
  public institutions: any[] =[];
  public academicYears: any[] =[];
  filterForm: any;

  isLoading = signal(false);
  sortState = sortStateSignal({});

  private fb = inject(FormBuilder);
  private service = inject(StudentService);
  private institutionService = inject(InstitutionService);
  private academicYearService = inject(AcademicYearService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sortService = inject(SortService);

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      q: [null],
      academicYearId: [null],
      institutionId: [null],
    })
    this.handleNavigation();
    this.institutionService.findAll('').subscribe((res: any) => {
      this.institutions = res.body
    })
    this.academicYearService.findAll('').subscribe((res: any) => {
      this.academicYears = res.body
    })
  }

  public loadAll() {
    this.service
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sortService.buildSortParam(this.sortState(), 'name'),
        q: this.filterForm.value.q?? '',
        iid: this.filterForm.value.institutionId?? '',
        y: this.filterForm.value.academicYearId?? '',
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
  }

  loadPage(event: PageChangedEvent): void {
    if (event.page !== this.previousPage) {
      this.page = event.page;
      this.previousPage = event.page;
      this.transition();
    }
  }

  onRefresh() {
    this.page = 1
    this.transition()
  }

  transition(sortState?: SortState): void {
    this.router.navigate(['/academic/student'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        iid: this.filterForm.value.institutionId,
        q: this.filterForm.value.q,
        sort: this.sortService.buildSortParam(sortState ?? this.sortState()),
      },
    });
    this.loadAll();
  }

  private handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      this.page = +(page ?? 1);
      this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data['defaultSort']));
      this.transition();
    });
  }

  onSelectRow(d: any) {
    this.service.findOne(d.id).subscribe((res: any) => {
      this.onEdit.emit(res.body);
    });
  }

  trackIdentity(index: number, d: any) {
    return d.id;
  }
}
