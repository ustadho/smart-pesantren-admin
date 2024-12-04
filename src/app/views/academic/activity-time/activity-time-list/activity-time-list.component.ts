import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { SortByDirective, SortDirective, SortService, SortState, sortStateSignal } from '../../../../shared/directive/sort';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectComponent } from '@ng-select/ng-select';
import { combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from '../../../../shared/constant/pagination.constants';
import { AcademicActivityTimeService } from '../../../../domain/service/academic-activity-time.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { SORT } from '../../../../shared/constant/navigation.constants';

@Component({
  selector: 'app-activity-time-list',
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
  templateUrl: './activity-time-list.component.html',
  styleUrl: './activity-time-list.component.scss'
})
export class ActivityTimeListComponent {
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Input() institutions: any[] =[];
  public totalItems: number = 0;
  public page: any;
  public previousPage: any;
  public itemsPerPage = ITEMS_PER_PAGE;
  public predicate: any;
  public data: any[] = [];
  filterForm: any;

  isLoading = signal(false);
  sortState = sortStateSignal({});

  private fb = inject(FormBuilder);
  private service = inject(AcademicActivityTimeService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sortService = inject(SortService);

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      institutionId: [null],
    })
    this.handleNavigation();
  }

  public loadAll() {
    this.service
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sortService.buildSortParam(this.sortState(), 'seq'),
        iid: this.filterForm.value.institutionId?? '',
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
    this.router.navigate(['/academic/activity-time'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        iid: this.filterForm.value.institutionId??'',
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
