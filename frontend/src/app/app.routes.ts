import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CatListComponent } from './components/cat-list/cat-list.component';
import { CatDetailComponent } from './components/cat-detail/cat-detail.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { MealListComponent } from './components/meal-list/meal-list.component';
import { StockComponent } from './components/stock/stock.component';
import { ApiDocComponent } from './components/api-doc/api-doc.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cats', component: CatListComponent },
  { path: 'cats/:id', component: CatDetailComponent },
  { path: 'humains', component: UserListComponent },
  { path: 'repas', component: MealListComponent },
  { path: 'stock', component: StockComponent },
  { path: 'api', component: ApiDocComponent },
  { path: '**', redirectTo: '' }
];
