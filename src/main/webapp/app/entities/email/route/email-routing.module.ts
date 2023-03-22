import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmailComponent } from '../list/email.component';
import { EmailDetailComponent } from '../detail/email-detail.component';
import { EmailUpdateComponent } from '../update/email-update.component';
import { EmailRoutingResolveService } from './email-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const emailRoute: Routes = [
  {
    path: '',
    component: EmailComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmailDetailComponent,
    resolve: {
      email: EmailRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmailUpdateComponent,
    resolve: {
      email: EmailRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmailUpdateComponent,
    resolve: {
      email: EmailRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emailRoute)],
  exports: [RouterModule],
})
export class EmailRoutingModule {}
