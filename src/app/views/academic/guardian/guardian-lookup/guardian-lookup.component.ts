import { Component, inject, OnInit, signal } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GuardianService } from '../../../../domain/service/guardian.service';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE } from '../../../../shared/constant/pagination.constants';
import { CommonModule } from '@angular/common';
import {
  SortByDirective,
  SortDirective,
  SortService,
  SortState,
  sortStateSignal,
} from '../../../../shared/directive/sort';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-guardian-lookup',
  standalone: true,
  imports: [
    FormsModule,
    PaginationModule,
    CommonModule,
    SortDirective,
    SortByDirective,
    FontAwesomeModule,
  ],
  templateUrl: './guardian-lookup.component.html',
  styleUrl: './guardian-lookup.component.scss',
})
export class GuardianLookupComponent implements OnInit {
  public q = '';
  public sex = '';
  public totalItems: number = 0;
  public page: any;
  public previousPage: any;
  public itemsPerPage = ITEMS_PER_PAGE;
  public data: any[] = [];
  isLoading = signal(false);
  sortState = sortStateSignal({});
  public onClose: Subject<Object> = new Subject();

  public predicate: any;

  public modalRef = inject(BsModalRef);
  private guardianService = inject(GuardianService);
  private sortService = inject(SortService);

  constructor() {


  }

  ngOnInit(): void {
    const page = 1;
    this.page = +(page ?? 1);
    this.sortState.set(
      this.sortService.parseSortParam('name')
    );
    this.loadData();
  }

  onSelectRow(d: any) {
    this.guardianService.findOne(d.id).subscribe((res: any) => {
      this.onClose.next(res.body);
      this.modalRef.hide();
    })
  }

  transition(sortState?: SortState): void {
    const sort = this.sortService.buildSortParam(sortState ?? this.sortState());
    this.loadData();
  }
  loadPage(event: PageChangedEvent): void {
    if (event.page !== this.previousPage) {
      this.page = event.page;
      this.previousPage = event.page;
    }
  }

  loadData() {
    this.guardianService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sortService.buildSortParam(this.sortState(), 'name'),
        q: this.q,
        sex: this.sex,
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

  trackIdentity(index: number, d: any) {
    return d.id;
  }
}
