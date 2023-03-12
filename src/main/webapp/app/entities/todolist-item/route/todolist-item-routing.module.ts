import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TodolistItemComponent } from '../list/todolist-item.component';
import { TodolistItemDetailComponent } from '../detail/todolist-item-detail.component';
import { TodolistItemUpdateComponent } from '../update/todolist-item-update.component';
import { TodolistItemRoutingResolveService } from './todolist-item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const todolistItemRoute: Routes = [
  {
    path: '',
    component: TodolistItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TodolistItemDetailComponent,
    resolve: {
      todolistItem: TodolistItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TodolistItemUpdateComponent,
    resolve: {
      todolistItem: TodolistItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TodolistItemUpdateComponent,
    resolve: {
      todolistItem: TodolistItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(todolistItemRoute)],
  exports: [RouterModule],
})
export class TodolistItemRoutingModule {}
