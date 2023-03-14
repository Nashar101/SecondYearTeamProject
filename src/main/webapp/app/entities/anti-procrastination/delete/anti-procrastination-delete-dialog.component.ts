import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAntiProcrastination } from '../anti-procrastination.model';
import { AntiProcrastinationService } from '../service/anti-procrastination.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './anti-procrastination-delete-dialog.component.html',
})
export class AntiProcrastinationDeleteDialogComponent {
  antiProcrastination?: IAntiProcrastination;

  constructor(protected antiProcrastinationService: AntiProcrastinationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.antiProcrastinationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
