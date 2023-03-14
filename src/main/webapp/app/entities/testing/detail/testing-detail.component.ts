import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITesting } from '../testing.model';

@Component({
  selector: 'jhi-testing-detail',
  templateUrl: './testing-detail.component.html',
})
export class TestingDetailComponent implements OnInit {
  testing: ITesting | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ testing }) => {
      this.testing = testing;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
