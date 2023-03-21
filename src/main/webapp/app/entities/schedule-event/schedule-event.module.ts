import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ScheduleEventComponent } from './list/schedule-event.component';
import { ScheduleEventDetailComponent } from './detail/schedule-event-detail.component';
import { ScheduleEventUpdateComponent } from './update/schedule-event-update.component';
import { ScheduleEventDeleteDialogComponent } from './delete/schedule-event-delete-dialog.component';
import { ScheduleEventRoutingModule } from './route/schedule-event-routing.module';

@NgModule({
  imports: [SharedModule, ScheduleEventRoutingModule],
  declarations: [ScheduleEventComponent, ScheduleEventDetailComponent, ScheduleEventUpdateComponent, ScheduleEventDeleteDialogComponent],
})
export class ScheduleEventModule {}
