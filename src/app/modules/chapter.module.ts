import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from '../components/chapter/detail/detail.component';

const routes: Routes = [
  {
    path: ':id',
    component: DetailComponent,
    data: { title: 'loading', id: 2 }
  },
  {
    path: ':id/:name',
    component: DetailComponent,
    data: { title: 'loading', id: 3 }
  }
];

@NgModule({
  declarations: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ChapterModule { }
