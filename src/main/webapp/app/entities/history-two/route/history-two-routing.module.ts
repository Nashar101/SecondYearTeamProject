import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HistoryTwoComponent } from '../list/history-two.component';
import { HistoryTwoDetailComponent } from '../detail/history-two-detail.component';
import { HistoryTwoUpdateComponent } from '../update/history-two-update.component';
import { HistoryTwoRoutingResolveService } from './history-two-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const historyTwoRoute: Routes = [
  {
    path: '',
    component: HistoryTwoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HistoryTwoDetailComponent,
    resolve: {
      historyTwo: HistoryTwoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HistoryTwoUpdateComponent,
    resolve: {
      historyTwo: HistoryTwoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HistoryTwoUpdateComponent,
    resolve: {
      historyTwo: HistoryTwoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(historyTwoRoute)],
  exports: [RouterModule],
})
export class HistoryTwoRoutingModule {}
