import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAntiprocrastinationListTwo } from '../antiprocrastination-list-two.model';

@Component({
  selector: 'jhi-antiprocrastination-list-two-detail',
  templateUrl: './antiprocrastination-list-two-detail.component.html',
})
export class AntiprocrastinationListTwoDetailComponent implements OnInit {
  antiprocrastinationListTwo: IAntiprocrastinationListTwo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ antiprocrastinationListTwo }) => {
      this.antiprocrastinationListTwo = antiprocrastinationListTwo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
