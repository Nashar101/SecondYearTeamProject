import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAntiProcrastinationList } from '../anti-procrastination-list.model';
import { AntiProcrastinationListService } from '../service/anti-procrastination-list.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './anti-procrastination-list-delete-dialog.component.html',
})
export class AntiProcrastinationListDeleteDialogComponent {
  antiProcrastinationList?: IAntiProcrastinationList;

  constructor(protected antiProcrastinationListService: AntiProcrastinationListService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.antiProcrastinationListService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
