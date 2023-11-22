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

const routes: Routes = [
  { path: '', component: LandingComponent, data: { animation: 'landing' } },
  { path: 'login', component: LoginComponent, data: { animation: 'login' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'login' } },
  { path: 'home', component: HomeComponent, data: { animation: 'home' }, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, data: { animation: 'settings' }, canActivate: [AuthGuard] },
  { path: 'tracks', component: TracksComponent, data: { animation: 'tracks' }, canActivate: [AuthGuard] },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
