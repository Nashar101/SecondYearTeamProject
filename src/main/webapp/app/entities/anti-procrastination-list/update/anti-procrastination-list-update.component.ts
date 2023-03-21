import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AntiProcrastinationListFormService, AntiProcrastinationListFormGroup } from './anti-procrastination-list-form.service';
import { IAntiProcrastinationList } from '../anti-procrastination-list.model';
import { AntiProcrastinationListService } from '../service/anti-procrastination-list.service';

@Component({
  selector: 'jhi-anti-procrastination-list-update',
  templateUrl: './anti-procrastination-list-update.component.html',
})
export class AntiProcrastinationListUpdateComponent implements OnInit {
  isSaving = false;
  antiProcrastinationList: IAntiProcrastinationList | null = null;

  editForm: AntiProcrastinationListFormGroup = this.antiProcrastinationListFormService.createAntiProcrastinationListFormGroup();

  constructor(
    protected antiProcrastinationListService: AntiProcrastinationListService,
    protected antiProcrastinationListFormService: AntiProcrastinationListFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ antiProcrastinationList }) => {
      this.antiProcrastinationList = antiProcrastinationList;
      if (antiProcrastinationList) {
        this.updateForm(antiProcrastinationList);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const antiProcrastinationList = this.antiProcrastinationListFormService.getAntiProcrastinationList(this.editForm);
    if (antiProcrastinationList.id !== null) {
      this.subscribeToSaveResponse(this.antiProcrastinationListService.update(antiProcrastinationList));
    } else {
      this.subscribeToSaveResponse(this.antiProcrastinationListService.create(antiProcrastinationList));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAntiProcrastinationList>>): void {
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

  protected updateForm(antiProcrastinationList: IAntiProcrastinationList): void {
    this.antiProcrastinationList = antiProcrastinationList;
    this.antiProcrastinationListFormService.resetForm(this.editForm, antiProcrastinationList);
  }
}
