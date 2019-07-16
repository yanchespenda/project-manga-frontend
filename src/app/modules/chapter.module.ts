import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ScrollingModule } from '@angular/cdk/scrolling';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from '../components/chapter/detail/detail.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: ':id',
    component: DetailComponent,
    data: { title: 'loading', id: 2, isMenuHidden: true, useChapterNav: true }
  }
];

@NgModule({
  declarations: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // ScrollingModule
    FlexLayoutModule,
    MatProgressSpinnerModule
  ]
})
export class ChapterModule { }
