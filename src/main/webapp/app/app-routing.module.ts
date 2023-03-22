import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';
import { TodoListComponent } from './todo-list/todo-list.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AntiProcrastinationComponent } from './anti-procrastination/anti-procrastination.component';

import { DPIAFormComponent } from './dpia-form/dpia-form.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { HistoryComponent } from './history/history.component';
import { DiaryComponent } from './diary/diary.component';
import { NotificationComponent } from './notification/notification.component';
import { AlarmComponent } from './alarm/alarm.component';
import { InboxComponent } from './inbox/inbox.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'anti-procrastination',
          component: AntiProcrastinationComponent,
        },
        {
          path: 'scheduler',
          component: SchedulerComponent,
        },
        {
          path: 'to-do-list',
          component: TodoListComponent,
        },
        {
          path: 'historypage',
          component: HistoryComponent,
        },
        {
          path: 'diarypage',
          component: DiaryComponent,
        },
        {
          path: 'notificationpage',
          component: NotificationComponent,
        },
        {
          path: 'inbox',
          component: InboxComponent,
        },
        {
          path: 'alarmpage',
          component: AlarmComponent,
        },
        {
          path: 'GDPR-policy&DPIAForm',
          component: DPIAFormComponent,
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
