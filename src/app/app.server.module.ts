import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { CookieService } from 'ngx-cookie-service';
import { CookieServerService } from './cookie-server.service';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FlexLayoutServerModule
  ],
  providers: [
    {
        provide: CookieService,
        useClass: CookieServerService
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
