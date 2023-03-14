import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAntiProcrastination } from '../anti-procrastination.model';

@Component({
  selector: 'jhi-anti-procrastination-detail',
  templateUrl: './anti-procrastination-detail.component.html',
})
export class AntiProcrastinationDetailComponent implements OnInit {
  antiProcrastination: IAntiProcrastination | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ antiProcrastination }) => {
      this.antiProcrastination = antiProcrastination;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
