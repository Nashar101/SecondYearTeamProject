import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AlarmComponent } from '../list/alarm.component';
import { AlarmDetailComponent } from '../detail/alarm-detail.component';
import { AlarmUpdateComponent } from '../update/alarm-update.component';
import { AlarmRoutingResolveService } from './alarm-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const alarmRoute: Routes = [
  {
    path: '',
    component: AlarmComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AlarmDetailComponent,
    resolve: {
      alarm: AlarmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AlarmUpdateComponent,
    resolve: {
      alarm: AlarmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AlarmUpdateComponent,
    resolve: {
      alarm: AlarmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(alarmRoute)],
  exports: [RouterModule],
})
export class AlarmRoutingModule {}
