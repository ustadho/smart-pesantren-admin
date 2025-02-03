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
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ActivityTimeCopyComponent } from '../activity-time-copy/activity-time-copy.component';

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
  providers: [BsModalService],
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
  sexs = [
    {id: "M", name: "Putra"},
    {id: "F", name: "Putri"},
  ]
  isLoading = signal(false);
  sortState = sortStateSignal({});
  selectedInstitution: any;

  private fb = inject(FormBuilder);
  private service = inject(AcademicActivityTimeService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sortService = inject(SortService);
  private modalRef?: BsModalRef;
  private bsModalService = inject(BsModalService);

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      institutionId: [null],
      sex: [null],
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
        sex: this.filterForm.value.sex??'',
      })
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);
          this.onSuccess(res.body, res.headers);
        },
        error: () => this.isLoading.set(false),
      });
  }

  onSelectInstitution(e: any) {
    console.log('onSelectInstitution', e)
    this.selectedInstitution = e
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
        sex: this.filterForm.value.sex??'',
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

  onCopy() {
    const initialState: ModalOptions = {
      initialState: {
        param: {
          sex: this.filterForm.value?.sex,
          institutionId: this.filterForm.value?.institutionId,
          institutionName: this.selectedInstitution?.name,
        },
        institutions: this.institutions,
        title: 'Lookup Santri',
      },
    };

    this.modalRef = this.bsModalService.show(
      ActivityTimeCopyComponent,
      initialState
    );
    this.modalRef.setClass('modal-lg');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((arr: any) => {
      this.loadAll()
    })
  }

  trackIdentity(index: number, d: any) {
    return d.id;
  }
}
