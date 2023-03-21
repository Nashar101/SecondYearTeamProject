import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IScheduleEvent } from '../schedule-event.model';
import { ScheduleEventService } from '../service/schedule-event.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './schedule-event-delete-dialog.component.html',
})
export class ScheduleEventDeleteDialogComponent {
  scheduleEvent?: IScheduleEvent;

  constructor(protected scheduleEventService: ScheduleEventService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.scheduleEventService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
