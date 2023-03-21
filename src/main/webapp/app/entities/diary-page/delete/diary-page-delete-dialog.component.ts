import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDiaryPage } from '../diary-page.model';
import { DiaryPageService } from '../service/diary-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './diary-page-delete-dialog.component.html',
})
export class DiaryPageDeleteDialogComponent {
  diaryPage?: IDiaryPage;

  constructor(protected diaryPageService: DiaryPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.diaryPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
