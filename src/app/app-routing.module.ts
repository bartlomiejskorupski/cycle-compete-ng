import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./auth/auth-guard.service";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RegisterComponent } from "./register/register.component";
import { SettingsComponent } from "./home/settings/settings.component";
import { TracksComponent } from "./home/tracks/tracks.component";
import { NewTrackComponent } from "./home/new-track/new-track.component";
import { NewTrackStartComponent } from "./home/new-track/start/new-track-start.component";
import { NewTrackRouteComponent } from "./home/new-track/route/new-track-route.component";
import { NewTrackInfoComponent } from "./home/new-track/info/new-track-info.component";
import { NewTrackConfirmComponent } from "./home/new-track/confirm/new-track-confirm.component";
import { TrackRunComponent } from "./home/track-run/track-run.component";

const routes: Routes = [
  { path: '', component: LandingComponent, data: { animation: 'landing' } },
  { path: 'login', component: LoginComponent, data: { animation: 'login' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'login' } },
  { path: 'home', component: HomeComponent, data: { animation: 'home' }, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, data: { animation: 'settings' }, canActivate: [AuthGuard] },
  { path: 'tracks', component: TracksComponent, data: { animation: 'tracks' }, canActivate: [AuthGuard] },
  { path: 'tracks/new', component: NewTrackComponent, data: { animation: 'new-track' }, canActivate: [AuthGuard], children: [
    { path: 'start', component: NewTrackStartComponent, data: { stepsIndex: 0 } },
    { path: 'route', component: NewTrackRouteComponent, data: { stepsIndex: 1 } },
    { path: 'info', component: NewTrackInfoComponent, data: { stepsIndex: 2 } },
    { path: 'confirm', component: NewTrackConfirmComponent, data: { stepsIndex: 3 } }
  ]},
  { path: 'run' , component: TrackRunComponent, data: { animation: 'run' }},
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
