import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Meal } from '../../models/meal.model';
import { StockCurrent } from '../../models/stock.model';
import { User } from '../../models/user.model';
import { Cat } from '../../models/cat.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  latestMealsByCat: any[] = [];
  recentMeals: Meal[] = [];
  currentStock: StockCurrent | null = null;
  isLoading = false;
  error: string | null = null;
  selectedUser: User | null = null;
  cats: Cat[] = [];
  stockThreshold = 10;

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.selectedUser = this.userService.getSelectedUser();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    
    // Load all data in parallel
    Promise.all([
      this.apiService.getLatestMealsByCat().toPromise(),
      this.apiService.getRecentMeals(20).toPromise(),
      this.apiService.getCurrentStock().toPromise(),
      this.apiService.getCats().toPromise()
    ]).then(([latestMealsByCat, recentMeals, currentStock, cats]) => {
      this.latestMealsByCat = latestMealsByCat || [];
      this.recentMeals = recentMeals || [];
      this.currentStock = currentStock || { currentStock: 0 };
      this.cats = cats || [];
      this.isLoading = false;
    }).catch((err) => {
      this.error = 'Impossible de charger les données du tableau de bord';
      this.isLoading = false;
      console.error('Error loading dashboard data:', err);
    });
  }

  getStockStatus(): string {
    if (!this.currentStock) return 'normal';
    
    if (this.currentStock.currentStock < 0) {
      return 'negative';
    } else if (this.currentStock.currentStock < this.stockThreshold) {
      return 'low';
    }
    return 'normal';
  }

  quickAddMeal(catId: number): void {
    const user = this.userService.getSelectedUser();
    if (!user) {
      this.error = 'Veuillez sélectionner un utilisateur avant d\'ajouter un repas';
      return;
    }

    const mealData = {
      cat_id: catId,
      user_id: user.id,
      fed_at: new Date().toISOString(),
      sachets_used: 1
    };

    this.apiService.createMeal(mealData).subscribe({
      next: () => {
        this.loadDashboardData();
      },
      error: (err) => {
        this.error = 'Impossible d\'ajouter le repas';
        console.error('Error adding meal:', err);
      }
    });
  }

  deleteMeal(mealId: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce repas ?')) {
      return;
    }

    this.apiService.deleteMeal(mealId).subscribe({
      next: () => {
        this.loadDashboardData();
      },
      error: (err) => {
        this.error = 'Impossible de supprimer le repas';
        console.error('Error deleting meal:', err);
      }
    });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
