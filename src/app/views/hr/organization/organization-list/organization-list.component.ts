import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationService } from '../../../../domain/service/organization.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';
import Swal from 'sweetalert2';
import { ParentChild } from '../../../../domain/model/parent-child.model';
import { TreeNode } from '../../../../domain/model/tree.model';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TreeTableModule,
    SweetAlert2Module,
  ],
  templateUrl: './organization-list.component.html',
  styleUrl: './organization-list.component.scss',
})
export class OrganizationListComponent {
  list: TreeNode[] = [];
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  filterForm: any;

  constructor(
    private service: OrganizationService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      typeId: [null],
    });

    this.findAll();
  }

  public findAll() {
    this.service.findAllTree().subscribe(
      (res: HttpResponse<any[]>) => {
        if (res.body != null) {
          this.list = this.buildTreeData(res.body);
        }
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );
  }

  onEditRow(x: any) {
    this.service.findOne(x.id).subscribe(
      (res: HttpResponse<any[]>) => {
        this.onEdit.emit(res.body);
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );
  }

  delete(x: any) {
    Swal.fire({
      title: 'Hapus Akun',
      text: `Anda yakin untuk menghapus Akun '${x.name}' kode '${x.code}'?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya Benar',
    }).then((result) => {
      if (result.value) {
        this.service.delete(x.id).subscribe((response) => {
          this.findAll();
        });
      }
    });
  }

  buildTreeData(data: ParentChild[]) {
    // Step 1: Buat map dari semua item berdasarkan id-nya
    const map: { [key: string]: TreeNode } = {};
    data.forEach((item) => {
      map[item.id] = { data: item, expanded: true, children: [] };
    });

    // Step 2: Buat array untuk menyimpan root items (dengan parentId null)
    const tree: TreeNode[] = [];

    // Step 3: Iterasi untuk membangun tree
    data.forEach((item) => {
      if (item.parentId === null) {
        // Jika parentId null, masukkan ke root
        tree.push(map[item.id]);
      } else {
        // Jika tidak, tambahkan ke children dari parent-nya
        if (map[item.parentId]) {
          map[item.parentId] = map[item.parentId] ?? { children: [] };
          map[item.parentId].children.push(map[item.id]);
        }
      }
    });
    return tree;
  }

  private onError(error: any) {
    if (error !== null) {
      this.toastr.error(error, error);
    }
  }
}
