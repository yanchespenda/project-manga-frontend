import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './../components/genre/index/index.component';
import { DetailComponent } from '../components/genre/detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Genre', id: 1, isMenuHidden: true }
  },
  {
    path: ':id',
    component: DetailComponent,
    data: { title: 'loading', id: 2, isMenuHidden: true }
  },
  {
    path: ':id/:name',
    component: DetailComponent,
    data: { title: 'loading', id: 3, isMenuHidden: true }
  }
];

@NgModule({
  declarations: [
    IndexComponent,
    DetailComponent,
    // ListComponent,
    // GenreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class GenreModule { }
