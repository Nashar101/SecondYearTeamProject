import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHistoryTwo } from '../history-two.model';

@Component({
  selector: 'jhi-history-two-detail',
  templateUrl: './history-two-detail.component.html',
})
export class HistoryTwoDetailComponent implements OnInit {
  historyTwo: IHistoryTwo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historyTwo }) => {
      this.historyTwo = historyTwo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
