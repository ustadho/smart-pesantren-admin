import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AttLogService } from '../../../domain/service/att-log.service';
import { combineLatest } from 'rxjs';
import { SORT } from '../../../shared/constant/navigation.constants';
import { ITEMS_PER_PAGE } from '../../../shared/constant/pagination.constants';
import { SortDirective } from '../../../shared/directive/sort/sort.directive';
import { SortService } from '../../../shared/directive/sort/sort.service';
import { SortState, sortStateSignal } from '../../../shared/directive/sort/sort-state';
import { NgxDaterangepickerBootstrapComponent, NgxDaterangepickerBootstrapDirective } from 'ngx-daterangepicker-bootstrap';

@Component({
  selector: 'app-att-log',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    FontAwesomeModule,
    SortDirective,
    BsDatepickerModule,
    NgxDaterangepickerBootstrapDirective, 
    NgxDaterangepickerBootstrapComponent,
  ],
  templateUrl: './att-log.component.html',
  styleUrl: './att-log.component.scss'
})
export class AttLogComponent {
public q = '';
  public dateRange: [Date, Date];

  constructor() {
    // Initialize with today's date
    const today = new Date();
    this.dateRange = [today, today];
  }
  public totalItems: number = 0;
  public page: any;
  public previousPage: any;
  public itemsPerPage = ITEMS_PER_PAGE;
  public predicate: any;
  public data: any[] = [];
  public selected: { start?: Date; end?: Date } = {
    start: new Date(),
    end: new Date()
  };

  isLoading = signal(false);
  sortState = sortStateSignal({});

  private attLogService = inject(AttLogService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sortService = inject(SortService);

  ngOnInit(): void {
    this.handleNavigation();
  }

  private formatDateForApi(date: Date | undefined, isEndDate: boolean = false): string | undefined {
    if (!date) return undefined;
    
    // Create a new date object to avoid modifying the original
    const adjustedDate = new Date(date);
    
    if (isEndDate) {
      // Set time to 23:59:59 for end date
      adjustedDate.setHours(23, 59, 59, 999);
    } else {
      // Set time to 00:00:00 for start date
      adjustedDate.setHours(0, 0, 0, 0);
    }
    
    // Format as yyyy-MM-ddTHH:mm:ss
    return adjustedDate.toISOString().replace(/\.\d{3}Z$/, '');
  }

  public loadAll() {
    this.attLogService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sortService.buildSortParam(this.sortState(), 'scanDate'),
        q: this.q,
        startDate: this.formatDateForApi(this.selected?.start, false),
        endDate: this.formatDateForApi(this.selected?.end, true),
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
    this.router.navigate(['/presence/att-log'], {
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


  trackIdentity(index: number, d: any) {
    return d.id;
  }
}
