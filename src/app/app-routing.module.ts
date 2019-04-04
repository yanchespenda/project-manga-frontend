import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Home', id: 1 }
  },
  {
    path: 'manga',
    component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Manga', id: 2 }
  },
  {
    path: 'genre',
    component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Gemre', id: 3 }
  },
  {
    path: 'blog',
    component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Blog', id: 4 }
  },
  { path: '**', redirectTo: '', data: { title: 'Not found', id: 0 } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
