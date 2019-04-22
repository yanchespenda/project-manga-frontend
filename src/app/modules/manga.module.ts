import { IndexComponent } from './../components/manga/index/index.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from '../components/manga/detail/detail.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Manga', id: 1 }
  },
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
    IndexComponent,
    DetailComponent,
    // ListComponent,
    // GenreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FlexLayoutModule,
    MatCardModule,
    MatMenuModule
  ]
})
export class MangaModule { }
