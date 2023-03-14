import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AntiProcrastinationComponent } from '../list/anti-procrastination.component';
import { AntiProcrastinationDetailComponent } from '../detail/anti-procrastination-detail.component';
import { AntiProcrastinationUpdateComponent } from '../update/anti-procrastination-update.component';
import { AntiProcrastinationRoutingResolveService } from './anti-procrastination-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const antiProcrastinationRoute: Routes = [
  {
    path: '',
    component: AntiProcrastinationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AntiProcrastinationDetailComponent,
    resolve: {
      antiProcrastination: AntiProcrastinationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AntiProcrastinationUpdateComponent,
    resolve: {
      antiProcrastination: AntiProcrastinationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AntiProcrastinationUpdateComponent,
    resolve: {
      antiProcrastination: AntiProcrastinationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(antiProcrastinationRoute)],
  exports: [RouterModule],
})
export class AntiProcrastinationRoutingModule {}
