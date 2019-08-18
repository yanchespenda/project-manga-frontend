import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CookieModule } from 'ngx-cookie';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
// import { NgxUploadModule } from '@wkoza/ngx-upload';
// import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';

// Material design components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TrendingComponent } from './components/home/c/trending/trending.component';
import { PopularComponent } from './components/home/c/popular/popular.component';
import { ListComponent } from './components/home/c/list/list.component';
import { GenreComponent } from './components/home/c/genre/genre.component';

import { SigninComponent, SigninDialogComponent } from './components/account/wom/signin/signin.component';
import { DoComponent } from './components/account/wom/do/do.component';
import { SignupComponent } from './components/account/wom/signup/signup.component';
import { LogoutComponent } from './components/account/wom/logout/logout.component';

import { AppHeaderComponent } from './components/main/app-header/app-header.component';
import { AppHeaderMenuComponent } from './components/main/app-header-menu/app-header-menu.component';
import { DatanotfoundComponent } from './components/helper/datanotfound/datanotfound.component';
import { FooterComponent } from './components/main/footer/footer.component';

import { ErrorHandlerService } from './services/http/error-handler.service';
import { InterceptorService } from './services/http/interceptor.service';
import { WINDOW_PROVIDERS } from './services/window/window.service';
import { ChapterReportDialogComponent } from './components/main/dialog/dialog.report';


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
    FooterComponent,
    DatanotfoundComponent,

    SigninComponent,

    SignupComponent,

    DoComponent,
    LogoutComponent,

    // DIALOGS
    SigninDialogComponent,
    ChapterReportDialogComponent,
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
    RecaptchaV3Module,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxHmCarouselModule,
    CookieModule.forRoot(),
    // NgxUploadModule.forRoot(),
    // ScrollingModule,
    // MatPasswordStrengthModule.forRoot(),

    // Material Components
    MatToolbarModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatGridListModule,
    MatDialogModule,
    MatRadioModule,
    MatRippleModule
  ],
  providers: [
    WINDOW_PROVIDERS,
    ErrorHandlerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.RECAPTCHA_SITE_KEY
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.RECAPTCHA_SITE_KEY,
      } as RecaptchaSettings,
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SigninDialogComponent,
    ChapterReportDialogComponent
  ]
})
export class AppModule { }
