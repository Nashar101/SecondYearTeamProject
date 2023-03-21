import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ScheduleEventComponent } from '../list/schedule-event.component';
import { ScheduleEventDetailComponent } from '../detail/schedule-event-detail.component';
import { ScheduleEventUpdateComponent } from '../update/schedule-event-update.component';
import { ScheduleEventRoutingResolveService } from './schedule-event-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const scheduleEventRoute: Routes = [
  {
    path: '',
    component: ScheduleEventComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScheduleEventDetailComponent,
    resolve: {
      scheduleEvent: ScheduleEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScheduleEventUpdateComponent,
    resolve: {
      scheduleEvent: ScheduleEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScheduleEventUpdateComponent,
    resolve: {
      scheduleEvent: ScheduleEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(scheduleEventRoute)],
  exports: [RouterModule],
})
export class ScheduleEventRoutingModule {}
