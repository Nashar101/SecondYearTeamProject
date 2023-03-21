import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AntiProcrastinationListComponent } from '../list/anti-procrastination-list.component';
import { AntiProcrastinationListDetailComponent } from '../detail/anti-procrastination-list-detail.component';
import { AntiProcrastinationListUpdateComponent } from '../update/anti-procrastination-list-update.component';
import { AntiProcrastinationListRoutingResolveService } from './anti-procrastination-list-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const antiProcrastinationListRoute: Routes = [
  {
    path: '',
    component: AntiProcrastinationListComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AntiProcrastinationListDetailComponent,
    resolve: {
      antiProcrastinationList: AntiProcrastinationListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AntiProcrastinationListUpdateComponent,
    resolve: {
      antiProcrastinationList: AntiProcrastinationListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AntiProcrastinationListUpdateComponent,
    resolve: {
      antiProcrastinationList: AntiProcrastinationListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(antiProcrastinationListRoute)],
  exports: [RouterModule],
})
export class AntiProcrastinationListRoutingModule {}
