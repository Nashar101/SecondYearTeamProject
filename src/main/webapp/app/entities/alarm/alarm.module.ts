import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AlarmComponent } from './list/alarm.component';
import { AlarmDetailComponent } from './detail/alarm-detail.component';
import { AlarmUpdateComponent } from './update/alarm-update.component';
import { AlarmDeleteDialogComponent } from './delete/alarm-delete-dialog.component';
import { AlarmRoutingModule } from './route/alarm-routing.module';

@NgModule({
  imports: [SharedModule, AlarmRoutingModule],
  declarations: [AlarmComponent, AlarmDetailComponent, AlarmUpdateComponent, AlarmDeleteDialogComponent],
})
export class AlarmModule {}
