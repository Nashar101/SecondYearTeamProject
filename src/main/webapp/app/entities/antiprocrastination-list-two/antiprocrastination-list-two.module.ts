import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AntiprocrastinationListTwoComponent } from './list/antiprocrastination-list-two.component';
import { AntiprocrastinationListTwoDetailComponent } from './detail/antiprocrastination-list-two-detail.component';
import { AntiprocrastinationListTwoUpdateComponent } from './update/antiprocrastination-list-two-update.component';
import { AntiprocrastinationListTwoDeleteDialogComponent } from './delete/antiprocrastination-list-two-delete-dialog.component';
import { AntiprocrastinationListTwoRoutingModule } from './route/antiprocrastination-list-two-routing.module';

@NgModule({
  imports: [SharedModule, AntiprocrastinationListTwoRoutingModule],
  declarations: [
    AntiprocrastinationListTwoComponent,
    AntiprocrastinationListTwoDetailComponent,
    AntiprocrastinationListTwoUpdateComponent,
    AntiprocrastinationListTwoDeleteDialogComponent,
  ],
})
export class AntiprocrastinationListTwoModule {}
