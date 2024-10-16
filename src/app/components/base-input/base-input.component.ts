import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-base-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './base-input.component.html',
  styleUrl: './base-input.component.scss'
})
export class BaseInputComponent {
  @Input() formGroup!: FormGroup;
  @Input() label!: string; // Label teks
  @Input() placeholder!: string;
  @Input() controlName!: string; // formControlName
  @Input() type: string = 'text'; // Jenis input (text, date, number, dll.)
  @Input() labelWidth: string = 'col-sm-2'; // Lebar label
  @Input() inputWidth: string = 'col-sm-10'; // Lebar input
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'; // Jenis form horizontal/vertical
}
