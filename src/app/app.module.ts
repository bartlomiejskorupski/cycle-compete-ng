import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ButtonModule } from 'primeng/button';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StartingComponent } from './home/starting/starting.component';
import { AuthGuard } from './auth-guard.service';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component'
import { InputTextModule } from 'primeng/inputtext'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    LoginComponent,
    HomeComponent,
    PageNotFoundComponent,
    StartingComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    ButtonModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
