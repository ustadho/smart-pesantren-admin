import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ColorPickerModule } from 'ngx-color-picker';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-base-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,
    BsDatepickerModule,
    ColorPickerModule,
    CalendarModule,
  ],
  templateUrl: './base-input.component.html',
  styleUrl: './base-input.component.scss',
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseInputComponent),
      multi: true,
    },
  ],
})
export class BaseInputComponent implements OnInit, AfterViewInit {
  @Input() formGroup!: FormGroup;
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() controlName!: string;
  @Input() type: string = 'text';
  @Input() labelWidth: string = 'col-sm-2';
  @Input() inputWidth: string = 'col-sm-10';
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'; // Jenis form horizontal/vertical
  @Input() items: any[] = [];
  @Input() rows: number = 2; // hanya untuk textarea
  @Input() autocomplete: string = '';
  @Input() autofocus: boolean = false;
  @Input() labelFormat: string = '${name}';
  @Input() bindValue: string = 'id';
  @Input() multiple: boolean = false;
  @Input() readonly: boolean = false;
  @Output() onSelectChange = new EventEmitter<any>();
  @Output() onKeyUp = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<any>();

  selectedCar: number | null = null;
  private searchText$ = new Subject<string>();

  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];
  public color = '#cccccc';

  bsConfig = {
    dateInputFormat: 'DD/MM/YYYY',
    // containerClass: 'theme-red',
    isAnimated: true,
    adaptivePosition: true,
  };

  value: any;

  constructor(private datePipe: DatePipe, private cdr: ChangeDetectorRef) {}

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formGroup.get(this.controlName)?.setValue(value, { emitEvent: true });
    this.valueChange.emit(value);
  }

  ngOnInit(): void {
    this.searchText$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((x) => this.onKeyUp.emit(x));

    if (this.type == 'color-picker') {
      this.color = this.formGroup.get(this.controlName)?.value;
    }
  }

  ngAfterViewInit() {
    if (this.type == 'bs-datepicker') {
      this.value = new Date(this.formGroup.get(this.controlName)?.value);
      this.cdr.detectChanges();
    }
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    
    if (item.name) {
      return item.name.toLowerCase().includes(term);
    } else if (item.noHalaman !== undefined) {
      // Convert both term and noHalaman to string for comparison
      const searchTerm = term.toString();
      const noHalaman = item.noHalaman.toString();
      return noHalaman.includes(searchTerm);
    }
    
    return false;
  }

  search(q: string) {
    this.searchText$.next(q);
  }

  getBindLabel(item: any): string {
    return this.labelFormat.replace(
      /\$\{(.*?)\}/g,
      (_, key) => (item[key] !== null && item[key] !== undefined ? item[key] : '')
    );
  }
  
  formatLabel(item: any): string {
    return this.labelFormat.replace(
      /\$\{(.*?)\}/g,
      (_, key) => (item[key] !== null && item[key] !== undefined ? item[key] : '')
    );
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSelectKeyUp() {}

  public onChangeColor(color: string): void {
    this.color = color;
    this.formGroup.get(this.controlName)?.setValue(color);
  }

  onDateChange(event: any) {
    setTimeout(() => {
      const formattedDate = this.datePipe.transform(event, 'yyyy-MM-dd');
      this.formGroup.get(this.controlName)?.setValue(formattedDate);
    });
  }
}
