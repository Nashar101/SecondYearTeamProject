import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DiaryPageComponent } from '../list/diary-page.component';
import { DiaryPageDetailComponent } from '../detail/diary-page-detail.component';
import { DiaryPageUpdateComponent } from '../update/diary-page-update.component';
import { DiaryPageRoutingResolveService } from './diary-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const diaryPageRoute: Routes = [
  {
    path: '',
    component: DiaryPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiaryPageDetailComponent,
    resolve: {
      diaryPage: DiaryPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiaryPageUpdateComponent,
    resolve: {
      diaryPage: DiaryPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiaryPageUpdateComponent,
    resolve: {
      diaryPage: DiaryPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(diaryPageRoute)],
  exports: [RouterModule],
})
export class DiaryPageRoutingModule {}
