import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { ITEMS_PER_PAGE } from '../../../../shared/constant/pagination.constants';
import { SortByDirective, SortDirective, SortService, SortState, sortStateSignal } from '../../../../shared/directive/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { combineLatest } from 'rxjs';
import { SORT } from '../../../../shared/constant/navigation.constants';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EmployeeCategoryService } from '../../../../domain/service/employee-category.service';

@Component({
  selector: 'app-employee-category-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule,
    SortDirective,
    SortByDirective,
    FontAwesomeModule,
  ],
  templateUrl: './employee-category-list.component.html',
})
export class EmployeeCategoryListComponent implements OnInit {
    @Output() onAdd = new EventEmitter<any>();
    @Output() onEdit = new EventEmitter<any>();

    public q = '';
    public totalItems: number = 0;
    public page: any;
    public previousPage: any;
    public itemsPerPage = ITEMS_PER_PAGE;
    public predicate: any;
    public data: any[] = [];

    isLoading = signal(false);
    sortState = sortStateSignal({});

    private service = inject(EmployeeCategoryService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private sortService = inject(SortService);

    ngOnInit(): void {
      this.handleNavigation();
    }

    public loadAll() {
      this.service
        .query({
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sortService.buildSortParam(this.sortState(), 'name'),
          q: this.q,
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
      this.router.navigate(['/hr/employee-category'], {
        relativeTo: this.activatedRoute.parent,
        queryParams: {
          page: this.page,
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

