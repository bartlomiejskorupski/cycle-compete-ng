import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { LoginComponent } from "./login/login.component";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./auth-guard.service";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { StartingComponent } from "./home/starting/starting.component";

const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'login', component: LoginComponent, data: { action: 'login' } },
  { path: 'register', component: LoginComponent, data: {action: 'register'} },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    {path: '', component: StartingComponent}
  ]},
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
