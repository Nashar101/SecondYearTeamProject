import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AntiprocrastinationListTwoFormService, AntiprocrastinationListTwoFormGroup } from './antiprocrastination-list-two-form.service';
import { IAntiprocrastinationListTwo } from '../antiprocrastination-list-two.model';
import { AntiprocrastinationListTwoService } from '../service/antiprocrastination-list-two.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-antiprocrastination-list-two-update',
  templateUrl: './antiprocrastination-list-two-update.component.html',
})
export class AntiprocrastinationListTwoUpdateComponent implements OnInit {
  isSaving = false;
  antiprocrastinationListTwo: IAntiprocrastinationListTwo | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: AntiprocrastinationListTwoFormGroup = this.antiprocrastinationListTwoFormService.createAntiprocrastinationListTwoFormGroup();

  constructor(
    protected antiprocrastinationListTwoService: AntiprocrastinationListTwoService,
    protected antiprocrastinationListTwoFormService: AntiprocrastinationListTwoFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ antiprocrastinationListTwo }) => {
      this.antiprocrastinationListTwo = antiprocrastinationListTwo;
      if (antiprocrastinationListTwo) {
        this.updateForm(antiprocrastinationListTwo);
      }
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const antiprocrastinationListTwo = this.antiprocrastinationListTwoFormService.getAntiprocrastinationListTwo(this.editForm);
    if (antiprocrastinationListTwo.id !== null) {
      this.subscribeToSaveResponse(this.antiprocrastinationListTwoService.update(antiprocrastinationListTwo));
    } else {
      this.subscribeToSaveResponse(this.antiprocrastinationListTwoService.create(antiprocrastinationListTwo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAntiprocrastinationListTwo>>): void {
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

  protected updateForm(antiprocrastinationListTwo: IAntiprocrastinationListTwo): void {
    this.antiprocrastinationListTwo = antiprocrastinationListTwo;
    this.antiprocrastinationListTwoFormService.resetForm(this.editForm, antiprocrastinationListTwo);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      antiprocrastinationListTwo.user
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.antiprocrastinationListTwo?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
