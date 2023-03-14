import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TestingFormService, TestingFormGroup } from './testing-form.service';
import { ITesting } from '../testing.model';
import { TestingService } from '../service/testing.service';

@Component({
  selector: 'jhi-testing-update',
  templateUrl: './testing-update.component.html',
})
export class TestingUpdateComponent implements OnInit {
  isSaving = false;
  testing: ITesting | null = null;

  editForm: TestingFormGroup = this.testingFormService.createTestingFormGroup();

  constructor(
    protected testingService: TestingService,
    protected testingFormService: TestingFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ testing }) => {
      this.testing = testing;
      if (testing) {
        this.updateForm(testing);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const testing = this.testingFormService.getTesting(this.editForm);
    if (testing.id !== null) {
      this.subscribeToSaveResponse(this.testingService.update(testing));
    } else {
      this.subscribeToSaveResponse(this.testingService.create(testing));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITesting>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(testing: ITesting): void {
    this.testing = testing;
    this.testingFormService.resetForm(this.editForm, testing);
  }
}
