import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AntiProcrastinationFormService, AntiProcrastinationFormGroup } from './anti-procrastination-form.service';
import { IAntiProcrastination } from '../anti-procrastination.model';
import { AntiProcrastinationService } from '../service/anti-procrastination.service';

@Component({
  selector: 'jhi-anti-procrastination-update',
  templateUrl: './anti-procrastination-update.component.html',
})
export class AntiProcrastinationUpdateComponent implements OnInit {
  isSaving = false;
  antiProcrastination: IAntiProcrastination | null = null;

  editForm: AntiProcrastinationFormGroup = this.antiProcrastinationFormService.createAntiProcrastinationFormGroup();

  constructor(
    protected antiProcrastinationService: AntiProcrastinationService,
    protected antiProcrastinationFormService: AntiProcrastinationFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ antiProcrastination }) => {
      this.antiProcrastination = antiProcrastination;
      if (antiProcrastination) {
        this.updateForm(antiProcrastination);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const antiProcrastination = this.antiProcrastinationFormService.getAntiProcrastination(this.editForm);
    if (antiProcrastination.id !== null) {
      this.subscribeToSaveResponse(this.antiProcrastinationService.update(antiProcrastination));
    } else {
      this.subscribeToSaveResponse(this.antiProcrastinationService.create(antiProcrastination));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAntiProcrastination>>): void {
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

  protected updateForm(antiProcrastination: IAntiProcrastination): void {
    this.antiProcrastination = antiProcrastination;
    this.antiProcrastinationFormService.resetForm(this.editForm, antiProcrastination);
  }
}
