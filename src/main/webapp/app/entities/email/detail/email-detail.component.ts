import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmail } from '../email.model';

@Component({
  selector: 'jhi-email-detail',
  templateUrl: './email-detail.component.html',
})
export class EmailDetailComponent implements OnInit {
  email: IEmail | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ email }) => {
      this.email = email;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
