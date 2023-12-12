import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { HeaderComponent } from './home/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StartingComponent } from './home/starting/starting.component';
import { AuthGuard } from './auth/auth-guard.service';
import { RegisterComponent } from './register/register.component'
import { PasswordsMatchDirective } from './shared/directive/passwords-match.directive';
import { MapComponent } from './home/map/map.component';
import { ValidPasswordDirective } from './shared/directive/valid-password.directive';
import { ValidNameDirective } from './shared/directive/valid-name.directive';
import { SettingsComponent } from './home/settings/settings.component';
import { AuthInterceptor } from './auth/auth-interceptor.service';
import { UpdatePopupComponent } from './shared/component/update-popup/update-popup.component';
import { TracksComponent } from './home/tracks/tracks.component';
import { NewTrackComponent } from './home/new-track/new-track.component';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password'
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { StepsModule } from 'primeng/steps';
import { NewTrackStartComponent } from './home/new-track/start/new-track-start.component';
import { NewTrackRouteComponent } from './home/new-track/route/new-track-route.component';
import { NewTrackInfoComponent } from './home/new-track/info/new-track-info.component';
import { NewTrackConfirmComponent } from './home/new-track/confirm/new-track-confirm.component';
import { TrackRunComponent } from './home/track-run/track-run.component';
import { TrackDetailsComponent } from './home/track-details/track-details.component';
import { HistoryComponent } from './home/history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    LoginComponent,
    HomeComponent,
    PageNotFoundComponent,
    StartingComponent,
    RegisterComponent,
    PasswordsMatchDirective,
    ValidPasswordDirective,
    ValidNameDirective,
    MapComponent,
    SettingsComponent,
    UpdatePopupComponent,
    TracksComponent,
    NewTrackComponent,
    NewTrackStartComponent,
    NewTrackRouteComponent,
    NewTrackInfoComponent,
    NewTrackConfirmComponent,
    TrackRunComponent,
    TrackDetailsComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    SidebarModule,
    MenuModule,
    DialogModule,
    MessagesModule,
    InputSwitchModule,
    StepsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    MessageService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
