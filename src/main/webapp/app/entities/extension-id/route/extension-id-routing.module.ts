import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExtensionIDComponent } from '../list/extension-id.component';
import { ExtensionIDDetailComponent } from '../detail/extension-id-detail.component';
import { ExtensionIDUpdateComponent } from '../update/extension-id-update.component';
import { ExtensionIDRoutingResolveService } from './extension-id-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const extensionIDRoute: Routes = [
  {
    path: '',
    component: ExtensionIDComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExtensionIDDetailComponent,
    resolve: {
      extensionID: ExtensionIDRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExtensionIDUpdateComponent,
    resolve: {
      extensionID: ExtensionIDRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExtensionIDUpdateComponent,
    resolve: {
      extensionID: ExtensionIDRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(extensionIDRoute)],
  exports: [RouterModule],
})
export class ExtensionIDRoutingModule {}
