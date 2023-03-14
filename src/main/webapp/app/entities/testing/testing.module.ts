import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TestingComponent } from './list/testing.component';
import { TestingDetailComponent } from './detail/testing-detail.component';
import { TestingUpdateComponent } from './update/testing-update.component';
import { TestingDeleteDialogComponent } from './delete/testing-delete-dialog.component';
import { TestingRoutingModule } from './route/testing-routing.module';

@NgModule({
  imports: [SharedModule, TestingRoutingModule],
  declarations: [TestingComponent, TestingDetailComponent, TestingUpdateComponent, TestingDeleteDialogComponent],
})
export class TestingModule {}
