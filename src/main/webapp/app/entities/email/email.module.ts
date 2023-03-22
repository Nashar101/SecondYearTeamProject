import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmailComponent } from './list/email.component';
import { EmailDetailComponent } from './detail/email-detail.component';
import { EmailUpdateComponent } from './update/email-update.component';
import { EmailDeleteDialogComponent } from './delete/email-delete-dialog.component';
import { EmailRoutingModule } from './route/email-routing.module';

@NgModule({
  imports: [SharedModule, EmailRoutingModule],
  declarations: [EmailComponent, EmailDetailComponent, EmailUpdateComponent, EmailDeleteDialogComponent],
})
export class EmailModule {}
