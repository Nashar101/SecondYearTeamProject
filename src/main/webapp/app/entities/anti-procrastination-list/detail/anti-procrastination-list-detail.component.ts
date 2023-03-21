import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAntiProcrastinationList } from '../anti-procrastination-list.model';

@Component({
  selector: 'jhi-anti-procrastination-list-detail',
  templateUrl: './anti-procrastination-list-detail.component.html',
})
export class AntiProcrastinationListDetailComponent implements OnInit {
  antiProcrastinationList: IAntiProcrastinationList | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ antiProcrastinationList }) => {
      this.antiProcrastinationList = antiProcrastinationList;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
