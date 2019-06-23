import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';

import { IndexComponent } from './../components/author/index/index.component';
import { DetailComponent } from '../components/author/detail/detail.component';

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
  }
];

@NgModule({
  declarations: [
    IndexComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FlexLayoutModule,
    MatCardModule
  ]
})
export class AuthorModule { }
