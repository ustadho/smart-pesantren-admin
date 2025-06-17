import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TahfidzKonversiService } from '../../../domain/service/tahfidz-konversi.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-tahfidz-konversi',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './tahfidz-konversi.component.html',
  styleUrls: ['./tahfidz-konversi.component.scss']
})
export class TahfidzKonversiComponent {
  form!: FormGroup;
  data: any[] = [];

  private fb = inject(FormBuilder);
  private tahfidzKonversiService = inject(TahfidzKonversiService);

  ngOnInit(): void {
    this.onRefresh();
  }

  onRefresh(): void {
    this.tahfidzKonversiService.findAll().subscribe({
      next: (data) => {
        console.log('data', data);
        this.data = data;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.data = [];
      }
    });
  }
}
