import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExtensionID } from '../extension-id.model';
import { ExtensionIDService } from '../service/extension-id.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './extension-id-delete-dialog.component.html',
})
export class ExtensionIDDeleteDialogComponent {
  extensionID?: IExtensionID;

  constructor(protected extensionIDService: ExtensionIDService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.extensionIDService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
