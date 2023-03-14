import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AntiProcrastinationComponent } from './list/anti-procrastination.component';
import { AntiProcrastinationDetailComponent } from './detail/anti-procrastination-detail.component';
import { AntiProcrastinationUpdateComponent } from './update/anti-procrastination-update.component';
import { AntiProcrastinationDeleteDialogComponent } from './delete/anti-procrastination-delete-dialog.component';
import { AntiProcrastinationRoutingModule } from './route/anti-procrastination-routing.module';

@NgModule({
  imports: [SharedModule, AntiProcrastinationRoutingModule],
  declarations: [
    AntiProcrastinationComponent,
    AntiProcrastinationDetailComponent,
    AntiProcrastinationUpdateComponent,
    AntiProcrastinationDeleteDialogComponent,
  ],
})
export class AntiProcrastinationModule {}
