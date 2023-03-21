import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAlarm } from '../alarm.model';

@Component({
  selector: 'jhi-alarm-detail',
  templateUrl: './alarm-detail.component.html',
})
export class AlarmDetailComponent implements OnInit {
  alarm: IAlarm | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ alarm }) => {
      this.alarm = alarm;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
