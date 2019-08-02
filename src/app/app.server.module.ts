import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { CookieService, CookieBackendService } from 'ngx-cookie';

import { AppModule } from './app.module';
/* import { AuthorModule } from './modules/author.module';
import { BlogModule } from './modules/blog.module';
import { ChapterModule } from './modules/chapter.module';
import { GenreModule } from './modules/genre.module';
import { MangaModule } from './modules/manga.module'; */

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ModuleMapLoaderModule,


    /* BlogModule,
    ChapterModule,
    GenreModule,
    MangaModule,
    AuthorModule, */

    ServerModule,
    FlexLayoutServerModule
  ],
  providers: [
    { provide: CookieService, useClass: CookieBackendService }
  ],
  bootstrap: [AppComponent],
  entryComponents: [

  ]
})
export class AppServerModule {}
