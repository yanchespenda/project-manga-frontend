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
    loadChildren: './modules/manga.module#MangaModule',
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Manga', id: 2 }
  },
  {
    path: 'genre',
    loadChildren: './modules/genre.module#GenreModule',
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Gemre', id: 3 }
  },
  {
    path: 'blog',
    loadChildren: './modules/blog.module#BlogModule',
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Blog', id: 4 }
  },
  {
    path: 'chapter',
    loadChildren: './modules/chapter.module#ChapterModule',
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Chapter', id: 5 }
  },
  {
    path: 'author',
    loadChildren: './modules/author.module#AuthorModule',
    // component: HomeComponent,
    // canActivate: [AuthGuardService],
    data: { title: 'Author', id: 6 }
  },
  { path: '**', redirectTo: '', data: { title: 'Not found', id: 0 } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
