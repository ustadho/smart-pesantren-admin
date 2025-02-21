import { CommonModule } from '@angular/common';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { combineLatest } from 'rxjs';
import { AccountService } from '../../../../core/auth/account.service';
import { UserService } from '../../../../core/user/user.service';
import { ITEMS_PER_PAGE } from '../../../../shared/constant/pagination.constants';
import { SortByDirective, SortDirective, SortService, SortState, sortStateSignal } from '../../../../shared/directive/sort';
import Swal from 'sweetalert2';
import { FormModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SORT } from '../../../../shared/constant/navigation.constants';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-user-management-list',
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
  templateUrl: './user-management-list.component.html',
  styleUrl: './user-management-list.component.scss'
})
export class UserManagementListComponent {
  @Input() profiles: any[] = []
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
  itemsPerPage = ITEMS_PER_PAGE;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  filterForm: FormGroup;
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
      profileId: [null],
      q: [''],
    });
  }

  ngOnInit(): void {
    this.accountService.identity().then(account => {
      this.currentAccount = account;
      this.handleNavigation();
    });

  }

  getProfileName(id: string) {
    if(id == null)
      return ""
      return this.profiles.find((e) => e.id == id).name
  }

  private handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      this.page = +(page ?? 1);
      this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data['defaultSort']));
      this.transition();
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
    this.router.navigate(['/setting/user-management'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        q: this.filterForm.getRawValue().q,
        profile: this.filterForm.getRawValue().profileId,
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
        sort: this.sortService.buildSortParam(this.sortState(), 'login'),
        q: this.filterForm.value.q??'',
        profile: this.filterForm.value.profileId??'',
      })
      .subscribe(
        (res: HttpResponse<any[]>) => this.onSuccess(res.body),
        (res: HttpResponse<any>) => this.onError(res.body)
      );
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

  setActive(user: any, isActivated: boolean) {

  }

  onSuccess(body: any) {
    this.totalItems = body.totalElements;
    this.listData = body;
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
