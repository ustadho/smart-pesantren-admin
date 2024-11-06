import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-working-schedule',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './working-schedule.component.html',
  styleUrl: './working-schedule.component.scss',
})
export class WorkingScheduleComponent implements OnInit {
  constructor() {

  }

  ngOnInit() {
  }

}
