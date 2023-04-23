import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AntiprocrastinationListTwoComponent } from '../list/antiprocrastination-list-two.component';
import { AntiprocrastinationListTwoDetailComponent } from '../detail/antiprocrastination-list-two-detail.component';
import { AntiprocrastinationListTwoUpdateComponent } from '../update/antiprocrastination-list-two-update.component';
import { AntiprocrastinationListTwoRoutingResolveService } from './antiprocrastination-list-two-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const antiprocrastinationListTwoRoute: Routes = [
  {
    path: '',
    component: AntiprocrastinationListTwoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AntiprocrastinationListTwoDetailComponent,
    resolve: {
      antiprocrastinationListTwo: AntiprocrastinationListTwoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AntiprocrastinationListTwoUpdateComponent,
    resolve: {
      antiprocrastinationListTwo: AntiprocrastinationListTwoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AntiprocrastinationListTwoUpdateComponent,
    resolve: {
      antiprocrastinationListTwo: AntiprocrastinationListTwoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(antiprocrastinationListTwoRoute)],
  exports: [RouterModule],
})
export class AntiprocrastinationListTwoRoutingModule {}
