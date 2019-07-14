import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { CookieService, CookieBackendService } from 'ngx-cookie';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FlexLayoutServerModule
  ],
  providers: [
    { provide: CookieService, useClass: CookieBackendService }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
