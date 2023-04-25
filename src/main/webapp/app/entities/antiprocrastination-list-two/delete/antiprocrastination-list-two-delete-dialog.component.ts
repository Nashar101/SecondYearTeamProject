import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAntiprocrastinationListTwo } from '../antiprocrastination-list-two.model';
import { AntiprocrastinationListTwoService } from '../service/antiprocrastination-list-two.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './antiprocrastination-list-two-delete-dialog.component.html',
})
export class AntiprocrastinationListTwoDeleteDialogComponent {
  antiprocrastinationListTwo?: IAntiprocrastinationListTwo;

  constructor(protected antiprocrastinationListTwoService: AntiprocrastinationListTwoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.antiprocrastinationListTwoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
