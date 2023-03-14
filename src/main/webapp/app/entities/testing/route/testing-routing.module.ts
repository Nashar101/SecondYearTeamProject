import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TestingComponent } from '../list/testing.component';
import { TestingDetailComponent } from '../detail/testing-detail.component';
import { TestingUpdateComponent } from '../update/testing-update.component';
import { TestingRoutingResolveService } from './testing-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const testingRoute: Routes = [
  {
    path: '',
    component: TestingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TestingDetailComponent,
    resolve: {
      testing: TestingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TestingUpdateComponent,
    resolve: {
      testing: TestingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TestingUpdateComponent,
    resolve: {
      testing: TestingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(testingRoute)],
  exports: [RouterModule],
})
export class TestingRoutingModule {}
