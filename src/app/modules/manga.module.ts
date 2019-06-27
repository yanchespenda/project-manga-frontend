import { IndexComponent } from './../components/manga/index/index.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Routes, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { DetailComponent } from '../components/manga/detail/detail.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    LazyLoadImageModule,

    FlexLayoutModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule,
    MatListModule,
    MatSnackBarModule
  ],
  providers: [ CookieService ],
})
export class MangaModule { }
