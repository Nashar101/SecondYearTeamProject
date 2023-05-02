import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistoryTwo } from '../history-two.model';
import { HistoryTwoService } from '../service/history-two.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './history-two-delete-dialog.component.html',
})
export class HistoryTwoDeleteDialogComponent {
  historyTwo?: IHistoryTwo;

  constructor(protected historyTwoService: HistoryTwoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.historyTwoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
