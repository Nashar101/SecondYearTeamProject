import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ExtensionIDFormService, ExtensionIDFormGroup } from './extension-id-form.service';
import { IExtensionID } from '../extension-id.model';
import { ExtensionIDService } from '../service/extension-id.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-extension-id-update',
  templateUrl: './extension-id-update.component.html',
})
export class ExtensionIDUpdateComponent implements OnInit {
  isSaving = false;
  extensionID: IExtensionID | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: ExtensionIDFormGroup = this.extensionIDFormService.createExtensionIDFormGroup();

  constructor(
    protected extensionIDService: ExtensionIDService,
    protected extensionIDFormService: ExtensionIDFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extensionID }) => {
      this.extensionID = extensionID;
      if (extensionID) {
        this.updateForm(extensionID);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const extensionID = this.extensionIDFormService.getExtensionID(this.editForm);
    if (extensionID.id !== null) {
      this.subscribeToSaveResponse(this.extensionIDService.update(extensionID));
    } else {
      this.subscribeToSaveResponse(this.extensionIDService.create(extensionID));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExtensionID>>): void {
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

  protected updateForm(extensionID: IExtensionID): void {
    this.extensionID = extensionID;
    this.extensionIDFormService.resetForm(this.editForm, extensionID);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, extensionID.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.extensionID?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
