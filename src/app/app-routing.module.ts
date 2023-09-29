import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { LoginComponent } from "./login/login.component";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./auth/auth-guard.service";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { StartingComponent } from "./home/starting/starting.component";
import { RegisterComponent } from "./register/register.component";
import { SettingsComponent } from "./home/settings/settings.component";

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    { path: '', component: StartingComponent },
  ]},
  { path: 'settings', component: SettingsComponent },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
