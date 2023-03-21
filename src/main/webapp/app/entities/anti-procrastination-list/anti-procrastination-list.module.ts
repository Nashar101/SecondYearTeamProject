import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AntiProcrastinationListComponent } from './list/anti-procrastination-list.component';
import { AntiProcrastinationListDetailComponent } from './detail/anti-procrastination-list-detail.component';
import { AntiProcrastinationListUpdateComponent } from './update/anti-procrastination-list-update.component';
import { AntiProcrastinationListDeleteDialogComponent } from './delete/anti-procrastination-list-delete-dialog.component';
import { AntiProcrastinationListRoutingModule } from './route/anti-procrastination-list-routing.module';

@NgModule({
  imports: [SharedModule, AntiProcrastinationListRoutingModule],
  declarations: [
    AntiProcrastinationListComponent,
    AntiProcrastinationListDetailComponent,
    AntiProcrastinationListUpdateComponent,
    AntiProcrastinationListDeleteDialogComponent,
  ],
})
export class AntiProcrastinationListModule {}
