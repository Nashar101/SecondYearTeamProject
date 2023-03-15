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
      /**{
        path: 'anti-procrastination',
        data: { pageTitle: 'teamprojectApp.antiProcrastination.home.title' },
        loadChildren: () => import('./anti-procrastination/anti-procrastination.module').then(m => m.AntiProcrastinationModule),
      },**/
      {
        path: 'testing',
        data: { pageTitle: 'teamprojectApp.testing.home.title' },
        loadChildren: () => import('./testing/testing.module').then(m => m.TestingModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
