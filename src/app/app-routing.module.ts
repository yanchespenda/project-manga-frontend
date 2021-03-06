import { SigninComponent } from './components/account/wom/signin/signin.component';
import { SignupComponent } from './components/account/wom/signup/signup.component';
import { DoComponent } from './components/account/wom/do/do.component';
import { LogoutComponent } from './components/account/wom/logout/logout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Home', id: 1, isMenuHidden: true }
  },
  {
    path: 'manga',
    // loadChildren: './modules/manga.module#MangaModule',
    loadChildren: () => import('./modules/manga.module').then(mod => mod.MangaModule),
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Manga', id: 2 }
  },
  {
    path: 'genre',
    // loadChildren: './modules/genre.module#GenreModule',
    loadChildren: () => import('./modules/genre.module').then(mod => mod.GenreModule),
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Gemre', id: 3 }
  },
  {
    path: 'blog',
    // loadChildren: './modules/blog.module#BlogModule',
    loadChildren: () => import('./modules/blog.module').then(mod => mod.BlogModule),
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Blog', id: 4 }
  },
  {
    path: 'chapter',
    // loadChildren: './modules/chapter.module#ChapterModule',
    loadChildren: () => import('./modules/chapter.module').then(mod => mod.ChapterModule),
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Chapter', id: 5 }
  },
  {
    path: 'author',
    // loadChildren: './modules/author.module#AuthorModule',
    loadChildren: () => import('./modules/author.module').then(mod => mod.AuthorModule),
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Author', id: 6 }
  },
  // Signin / Signip
  {
    path: 'oauth/signin',
    component: SigninComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Signin', id: 7, isMenuHidden: true, hideTopNav: true }
  },
  {
    path: 'oauth/signup',
    component: SignupComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Signup', id: 8, isMenuHidden: true, hideTopNav: true }
  },
  {
    path: 'oauth/do',
    component: DoComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Do', id: 9, isMenuHidden: true, hideTopNav: true }
  },
  {
    path: 'oauth/do/logout',
    component: LogoutComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Logout', id: 10, isMenuHidden: true, hideTopNav: true }
  },
  { path: '**', redirectTo: '', data: { title: 'Not found', id: 0 } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
    // onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
