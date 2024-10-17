import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-base-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,
  ],
  templateUrl: './base-input.component.html',
  styleUrl: './base-input.component.scss',
})
export class BaseInputComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() controlName!: string;
  @Input() type: string = 'text';
  @Input() labelWidth: string = 'col-sm-2';
  @Input() inputWidth: string = 'col-sm-10';
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'; // Jenis form horizontal/vertical
  @Input() items: any[] = []
  @Output() onSelectChange = new EventEmitter<any>();
  @Output() onKeyUp = new EventEmitter<string>();

  selectedCar: number | null = null;
  private searchText$ = new Subject<string>();

  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];

  ngOnInit(): void {
    this.searchText$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(x => this.onKeyUp.emit(x))
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.name.toLowerCase().includes(term) || item.code == null || item.code.toLowerCase().includes(term);
  }

  search(q: string) {
    this.searchText$.next(q);
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSelectKeyUp() {

  }
}
