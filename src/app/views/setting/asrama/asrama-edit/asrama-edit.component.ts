import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ITab } from '../../../../domain/model/tab.model';
import { AsramaService } from '../../../../domain/service/asrama.service';
import { BuildingService } from '../../../../domain/service/building.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asrama-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputComponent, SubmitButtonComponent, ColorPickerModule],
  templateUrl: './asrama-edit.component.html',
  styleUrl: './asrama-edit.component.scss'
})
export class AsramaEditComponent {
  @Input() activeTab?: ITab;
  buildings: any[] =[]
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  isSubmitting = false;


  constructor(
    private fb: FormBuilder,
    private service: AsramaService,
    private buildingService: BuildingService,
    private toast: ToastrService
  ) {
    this.form = fb.group({
      id: [null],
      buildingId: [null, [Validators.required]],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
    });
  }

  ngOnInit(): void {
    if(this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data)
    }
    this.buildingService.findAll({q: '', locationId: ''}).subscribe(res => {
      this.buildings = res.body
    })
  }
  onParentKeyUp(e: any) {

  }

  onSelectChange() {
    console.group('onSelectChange');
  }

  onSubmit() {
    this.isSubmitting = true;
    if (this.form.getRawValue().id == null) {
      this.service.create(this.form.getRawValue()).subscribe((res: any) => {
        this.isSubmitting = false
        this.toast.success('Tambah data sukses')
        setTimeout(() => {
          this.onReset();
        }, 200);
      });
    } else {
      this.service.update(this.form.getRawValue()).subscribe((res: any) => {
        this.isSubmitting = false
        this.toast.success('Update data sukses')
        this.onRemove.emit(this.activeTab)
        setTimeout(() => {
          this.onReset();
        }, 200);
      });
    }
  }

  onDelete() {
    if(this.activeTab == null || this.activeTab.data == null) {
      return
    }

    Swal
      .fire({
        title: 'Hapus data',
        text: `Anda yakin untuk menghapus ' ${this.activeTab.data.name}'?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result) => {
        if (result.value) {
          this.service.delete(this.activeTab?.data.id).subscribe(response => {
            if(this.form.getRawValue().id != null) {
              this.toast.success('Hapus data sukses')
              this.onRemove.emit(this.activeTab)
            } else{
              this.onReset()
            }
          });
        }
      });
  }

  onReset() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }
}
