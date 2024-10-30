import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.scss'
})
export class SubmitButtonComponent {
  @Input() isSubmitting: boolean = false; // Disable button selama submit
  @Input() buttonText: string = 'Simpan'; // Text default untuk button
}
