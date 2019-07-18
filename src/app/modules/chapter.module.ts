import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ScrollingModule } from '@angular/cdk/scrolling';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from '../components/chapter/detail/detail.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

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
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule
  ]
})
export class ChapterModule { }
