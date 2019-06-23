import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';

// Material design components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TrendingComponent } from './components/home/c/trending/trending.component';
import { PopularComponent } from './components/home/c/popular/popular.component';
import { ListComponent } from './components/home/c/list/list.component';
import { GenreComponent } from './components/home/c/genre/genre.component';

import { AppHeaderComponent } from './components/main/app-header/app-header.component';
import { AppHeaderMenuComponent } from './components/main/app-header-menu/app-header-menu.component';
import { DatanotfoundComponent } from './components/helper/datanotfound/datanotfound.component';

import { ErrorHandlerService } from './services/http/error-handler.service';
import { InterceptorService } from './services/http/interceptor.service';

@NgModule({
  declarations: [
    AppComponent,

    HomeComponent,
    TrendingComponent,
    PopularComponent,
    ListComponent,
    GenreComponent,

    AppHeaderComponent,
    AppHeaderMenuComponent,
    DatanotfoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    LazyLoadImageModule,

    // Material Components
    MatToolbarModule,
    MatCardModule,
    MatProgressBarModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatGridListModule
  ],
  providers: [
    ErrorHandlerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
