import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { combineLatest } from 'rxjs';
import { SORT } from '../../../../shared/constant/navigation.constants';
import { ITEMS_PER_PAGE } from '../../../../shared/constant/pagination.constants';
import { SortByDirective, SortDirective, SortService, SortState, sortStateSignal } from '../../../../shared/directive/sort';
import { HalaqohService } from 'src/app/domain/service/halaqoh.service';

@Component({
  selector: 'app-halaqoh-mapping-list',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PaginationModule,
    SortDirective,
    SortByDirective,
    FontAwesomeModule,
    NgSelectModule,
  ],
  templateUrl: './halaqoh-mapping-list.component.html',
  styleUrl: './halaqoh-mapping-list.component.scss'
})
export class HalaqohMappingListComponent {
  @Input() public pesantrens: any[] = [];
  @Input() public academicYears: any[] = [];
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  public totalItems: number = 0;
  public page: any;
  public previousPage: any;
  public itemsPerPage = ITEMS_PER_PAGE;
  public predicate: any;
  public data: any[] = [];
  public filterForm: FormGroup;

  isLoading = signal(false);
  sortState = sortStateSignal({});

  private service = inject(HalaqohService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sortService = inject(SortService);
  private fb = inject(FormBuilder)

  constructor() {
    this.filterForm = this.fb.group({
      academicYearId: [null],
      pesantrenId: [null],
      q: ['']
    })
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const defaultYear = this.academicYears.find((e: any) => e.isDefault === true);
      if (defaultYear) {
        this.filterForm.get('academicYearId')?.setValue(defaultYear.id);
      }
    }, 700)
  }

  selectPesantren(evt: any) {
    console.log('selectPesantren', evt)
  }

  public loadAll() {
    this.service
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sortService.buildSortParam(this.sortState(), 'description'),
        academicYear: this.filterForm.value.academicYearId ?? '',
        pesantren: this.filterForm.value.pesantrenId ?? '',
        q: this.filterForm.value.q ?? '',
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
    this.router.navigate(['/pengasuhan/halaqoh-mapping'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: this.sortService.buildSortParam(sortState ?? this.sortState()),
        academicYear: this.filterForm.value.academicYearId ?? '',
        pesantren: this.filterForm.value.pesantrenId ?? '',
        q: this.filterForm.value.q ?? '',
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
