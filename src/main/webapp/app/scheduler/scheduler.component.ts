import { Component, OnInit } from '@angular/core';
import { ScheduleEventService } from '../entities/schedule-event/service/schedule-event.service';

export class List {
  title!: string;
  description!: string;
  time!: string;
}
@Component({
  selector: 'jhi-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit {
  title: string = '';
  description: string = '';
  time: string = '';
  schedule: List[] = [];
  add() {
    let newEntry = new List();
    newEntry.title = this.title;
    newEntry.description = this.description;
    newEntry.time = this.time;
    this.schedule.push(newEntry);
  }
  constructor() {}

  ngOnInit(): void {}
}
