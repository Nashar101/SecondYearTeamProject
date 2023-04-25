import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExtensionIDComponent } from './list/extension-id.component';
import { ExtensionIDDetailComponent } from './detail/extension-id-detail.component';
import { ExtensionIDUpdateComponent } from './update/extension-id-update.component';
import { ExtensionIDDeleteDialogComponent } from './delete/extension-id-delete-dialog.component';
import { ExtensionIDRoutingModule } from './route/extension-id-routing.module';

@NgModule({
  imports: [SharedModule, ExtensionIDRoutingModule],
  declarations: [ExtensionIDComponent, ExtensionIDDetailComponent, ExtensionIDUpdateComponent, ExtensionIDDeleteDialogComponent],
})
export class ExtensionIDModule {}
