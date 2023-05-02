import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HistoryTwoComponent } from './list/history-two.component';
import { HistoryTwoDetailComponent } from './detail/history-two-detail.component';
import { HistoryTwoUpdateComponent } from './update/history-two-update.component';
import { HistoryTwoDeleteDialogComponent } from './delete/history-two-delete-dialog.component';
import { HistoryTwoRoutingModule } from './route/history-two-routing.module';

@NgModule({
  imports: [SharedModule, HistoryTwoRoutingModule],
  declarations: [HistoryTwoComponent, HistoryTwoDetailComponent, HistoryTwoUpdateComponent, HistoryTwoDeleteDialogComponent],
})
export class HistoryTwoModule {}
