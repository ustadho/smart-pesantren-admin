import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { ITEMS_PER_PAGE } from 'src/app/shared/constant/pagination.constants';
import { SortByDirective, SortDirective, SortService, SortState, sortStateSignal } from 'src/app/shared/directive/sort';
import { HRHolidayService } from 'src/app/domain/service/hr-holiday'
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { SORT } from 'src/app/shared/constant/navigation.constants';

@Component({
  selector: 'app-holiday-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule,
    SortDirective,
    SortByDirective,
    FontAwesomeModule,
  ],
  templateUrl: './holiday-list.component.html',
  styleUrl: './holiday-list.component.scss'
})
export class HolidayListComponent implements OnInit {
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();

  public q = '';
  public y = (new Date()).getFullYear();
  public totalItems: number = 0;
  public page: any;
  public previousPage: any;
  public itemsPerPage = ITEMS_PER_PAGE;
  public predicate: any;
  public data: any[] = [];

  isLoading = signal(false);
  sortState = sortStateSignal({});

  private holidayService = inject(HRHolidayService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sortService = inject(SortService);

  ngOnInit(): void {
    this.handleNavigation();
  }

  public loadAll() {
    this.holidayService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sortService.buildSortParam(this.sortState(), 'eventDate'),
        q: this.q,
        y: this.y,
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
    this.router.navigate(['/presence/holiday'], {
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
    this.holidayService.findOne(d.id).subscribe((res: any) => {
      this.onEdit.emit(res.body);
    });
  }

  trackIdentity(index: number, d: any) {
    return d.id;
  }
}

