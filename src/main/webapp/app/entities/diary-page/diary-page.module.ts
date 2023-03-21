import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DiaryPageComponent } from './list/diary-page.component';
import { DiaryPageDetailComponent } from './detail/diary-page-detail.component';
import { DiaryPageUpdateComponent } from './update/diary-page-update.component';
import { DiaryPageDeleteDialogComponent } from './delete/diary-page-delete-dialog.component';
import { DiaryPageRoutingModule } from './route/diary-page-routing.module';

@NgModule({
  imports: [SharedModule, DiaryPageRoutingModule],
  declarations: [DiaryPageComponent, DiaryPageDetailComponent, DiaryPageUpdateComponent, DiaryPageDeleteDialogComponent],
})
export class DiaryPageModule {}
