import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ScheduleEventFormService, ScheduleEventFormGroup } from './schedule-event-form.service';
import { IScheduleEvent } from '../schedule-event.model';
import { ScheduleEventService } from '../service/schedule-event.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-schedule-event-update',
  templateUrl: './schedule-event-update.component.html',
})
export class ScheduleEventUpdateComponent implements OnInit {
  isSaving = false;
  scheduleEvent: IScheduleEvent | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: ScheduleEventFormGroup = this.scheduleEventFormService.createScheduleEventFormGroup();

  constructor(
    protected scheduleEventService: ScheduleEventService,
    protected scheduleEventFormService: ScheduleEventFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ scheduleEvent }) => {
      this.scheduleEvent = scheduleEvent;
      if (scheduleEvent) {
        this.updateForm(scheduleEvent);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const scheduleEvent = this.scheduleEventFormService.getScheduleEvent(this.editForm);
    if (scheduleEvent.id !== null) {
      this.subscribeToSaveResponse(this.scheduleEventService.update(scheduleEvent));
    } else {
      this.subscribeToSaveResponse(this.scheduleEventService.create(scheduleEvent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScheduleEvent>>): void {
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

  protected updateForm(scheduleEvent: IScheduleEvent): void {
    this.scheduleEvent = scheduleEvent;
    this.scheduleEventFormService.resetForm(this.editForm, scheduleEvent);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, scheduleEvent.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.scheduleEvent?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
