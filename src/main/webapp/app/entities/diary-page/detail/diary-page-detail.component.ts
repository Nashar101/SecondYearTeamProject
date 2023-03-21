import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDiaryPage } from '../diary-page.model';

@Component({
  selector: 'jhi-diary-page-detail',
  templateUrl: './diary-page-detail.component.html',
})
export class DiaryPageDetailComponent implements OnInit {
  diaryPage: IDiaryPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diaryPage }) => {
      this.diaryPage = diaryPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
