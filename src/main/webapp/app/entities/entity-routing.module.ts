import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'blog',
        data: { pageTitle: 'teamprojectApp.blog.home.title' },
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'teamprojectApp.post.home.title' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'tag',
        data: { pageTitle: 'teamprojectApp.tag.home.title' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'testing',
        data: { pageTitle: 'teamprojectApp.testing.home.title' },
        loadChildren: () => import('./testing/testing.module').then(m => m.TestingModule),
      },
      {
        path: 'todolist-item',
        data: { pageTitle: 'teamprojectApp.todolistItem.home.title' },
        loadChildren: () => import('./todolist-item/todolist-item.module').then(m => m.TodolistItemModule),
      },
      {
        path: 'anti-procrastination-list',
        data: { pageTitle: 'teamprojectApp.antiProcrastinationList.home.title' },
        loadChildren: () =>
          import('./anti-procrastination-list/anti-procrastination-list.module').then(m => m.AntiProcrastinationListModule),
      },
      {
        path: 'schedule-event',
        data: { pageTitle: 'teamprojectApp.scheduleEvent.home.title' },
        loadChildren: () => import('./schedule-event/schedule-event.module').then(m => m.ScheduleEventModule),
      },
      {
        path: 'history',
        data: { pageTitle: 'teamprojectApp.history.home.title' },
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
      },
      {
        path: 'alarm',
        data: { pageTitle: 'teamprojectApp.alarm.home.title' },
        loadChildren: () => import('./alarm/alarm.module').then(m => m.AlarmModule),
      },
      {
        path: 'diary-page',
        data: { pageTitle: 'teamprojectApp.diaryPage.home.title' },
        loadChildren: () => import('./diary-page/diary-page.module').then(m => m.DiaryPageModule),
      },
      {
        path: 'to-do-item',
        data: { pageTitle: 'teamprojectApp.toDoItem.home.title' },
        loadChildren: () => import('./to-do-item/to-do-item.module').then(m => m.ToDoItemModule),
      },
      {
        path: 'email',
        data: { pageTitle: 'teamprojectApp.email.home.title' },
        loadChildren: () => import('./email/email.module').then(m => m.EmailModule),
      },
      {
        path: 'notification',
        data: { pageTitle: 'teamprojectApp.notification.home.title' },
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
