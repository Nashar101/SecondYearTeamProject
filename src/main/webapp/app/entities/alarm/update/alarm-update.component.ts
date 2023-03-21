import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AlarmFormService, AlarmFormGroup } from './alarm-form.service';
import { IAlarm } from '../alarm.model';
import { AlarmService } from '../service/alarm.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-alarm-update',
  templateUrl: './alarm-update.component.html',
})
export class AlarmUpdateComponent implements OnInit {
  isSaving = false;
  alarm: IAlarm | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: AlarmFormGroup = this.alarmFormService.createAlarmFormGroup();

  constructor(
    protected alarmService: AlarmService,
    protected alarmFormService: AlarmFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ alarm }) => {
      this.alarm = alarm;
      if (alarm) {
        this.updateForm(alarm);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const alarm = this.alarmFormService.getAlarm(this.editForm);
    if (alarm.id !== null) {
      this.subscribeToSaveResponse(this.alarmService.update(alarm));
    } else {
      this.subscribeToSaveResponse(this.alarmService.create(alarm));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlarm>>): void {
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

  protected updateForm(alarm: IAlarm): void {
    this.alarm = alarm;
    this.alarmFormService.resetForm(this.editForm, alarm);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, alarm.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.alarm?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
