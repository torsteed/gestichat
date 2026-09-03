import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CatListComponent } from './components/cat-list/cat-list.component';
import { CatDetailComponent } from './components/cat-detail/cat-detail.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { MealListComponent } from './components/meal-list/meal-list.component';
import { StockComponent } from './components/stock/stock.component';
import { ApiDocComponent } from './components/api-doc/api-doc.component';

import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { UserSelectedGuard } from './guards/user-selected.guard';

import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    CatListComponent,
    CatDetailComponent,
    UserListComponent,
    MealListComponent,
    StockComponent,
    ApiDocComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    ApiService,
    UserService,
    UserSelectedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
