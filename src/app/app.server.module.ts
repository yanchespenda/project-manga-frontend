import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { CookieService, CookieBackendService } from 'ngx-cookie';

import { AppModule } from './app.module';
import { BlogModule } from './modules/blog.module';
import { ChapterModule } from './modules/chapter.module';
import { GenreModule } from './modules/genre.module';
import { MangaModule } from './modules/manga.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    BlogModule,
    ChapterModule,
    GenreModule,
    MangaModule,

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
