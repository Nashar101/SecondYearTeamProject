import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IScheduleEvent } from '../schedule-event.model';

@Component({
  selector: 'jhi-schedule-event-detail',
  templateUrl: './schedule-event-detail.component.html',
})
export class ScheduleEventDetailComponent implements OnInit {
  scheduleEvent: IScheduleEvent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ scheduleEvent }) => {
      this.scheduleEvent = scheduleEvent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
