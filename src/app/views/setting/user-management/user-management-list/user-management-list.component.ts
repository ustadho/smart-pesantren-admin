import { CommonModule } from '@angular/common';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { combineLatest } from 'rxjs';
import { AccountService } from 'src/app/core/auth/account.service';
import { UserService } from 'src/app/core/user/user.service';
import { ITEMS_PER_PAGE } from 'src/app/shared/constant/pagination.constants';
import { SortByDirective, SortDirective, SortService, SortState, sortStateSignal } from 'src/app/shared/directive/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule,
    SortDirective,
    SortByDirective,
    FontAwesomeModule,
  ],
  templateUrl: './user-management-list.component.html',
  styleUrl: './user-management-list.component.scss'
})
export class UserManagementListComponent {
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  currentData: any;
  listData: any[] = [];
  error: any;
  success: any;
  routeData: any;
  links: any;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  filterForm: any;
  currentAccount: any;
  isLoading = signal(false);
  sortState = sortStateSignal({});

  private service = inject(UserService);
  private accountService = inject(AccountService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sortService = inject(SortService);

  constructor(
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      q: [''],
    });

    this.itemsPerPage = 50;
    this.routeData = this.activatedRoute.data.subscribe((data: any) => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
  }

  ngOnInit(): void {
    this.accountService.identity().then(account => {
      this.currentAccount = account;
      this.loadAll();
    });

  }

  edit(d: any) {
    this.service.find(d.login).subscribe(res => {
      this.onEdit.emit(res.body)
    })
  }

  delete(a: any) {
    Swal
      .fire({
        title: 'Hapus Item',
        text: `Anda yakin untuk menghapus ' ${a.name}'?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result) => {
        if (result.value) {
          this.service.delete(a.id).subscribe(response => {
            this.loadAll();
          });
        }
      });
  }

  onRefresh() {
    this.page = 1
    this.transition()
  }

  transition(sortState?: SortState): void {
    this.router.navigate(['/setting/academic-year'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: this.sortService.buildSortParam(sortState ?? this.sortState()),
      },
    });
    this.loadAll();
  }

  loadAll() {
    this.service
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        q: this.filterForm.value.q??'',
      })
      .subscribe(
        (res: HttpResponse<any[]>) => this.onSuccess(res.body),
        (res: HttpResponse<any>) => this.onError(res.body)
      );
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  trackIdentity(a: any) {
    return a.id;
  }

  loadPage(event: PageChangedEvent): void {
    if (event.page !== this.previousPage) {
      this.page = event.page;
      this.previousPage = event.page;
      this.loadAll();
    }
  }

  private onSuccess(data: any) {
    this.totalItems = data.totalElements;
    this.queryCount = this.totalItems;
    this.listData = data.content;
  }

  private onError(err: any) {

  }

  filter(event: any) {
    if (event.key === "Enter") {
      this.page=1;
      this.loadAll();
    }
  }

}
