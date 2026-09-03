import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Meal, MealCreate } from '../../models/meal.model';
import { Cat } from '../../models/cat.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-meal-list',
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.scss']
})
export class MealListComponent implements OnInit {
  meals: Meal[] = [];
  cats: Cat[] = [];
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  selectedUser: User | null = null;
  
  // Form fields for new meal
  newMeal = {
    cat_id: 0,
    user_id: 0,
    fed_at: new Date().toISOString(),
    sachets_used: 1
  };
  
  // Filter fields
  filterCatId: number | null = null;
  filterUserId: number | null = null;
  filterLimit = 50;
  showFilters = false;

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.selectedUser = this.userService.getSelectedUser();
    
    if (this.selectedUser) {
      this.newMeal.user_id = this.selectedUser.id;
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    
    Promise.all([
      this.apiService.getMeals(this.filterLimit, this.filterCatId || undefined, this.filterUserId || undefined).toPromise(),
      this.apiService.getCats().toPromise(),
      this.apiService.getUsers().toPromise()
    ]).then(([meals, cats, users]) => {
      this.meals = meals || [];
      this.cats = cats || [];
      this.users = users || [];
      this.isLoading = false;
    }).catch((err) => {
      this.error = 'Impossible de charger les repas';
      this.isLoading = false;
      console.error('Error loading meals:', err);
    });
  }

  createMeal(): void {
    if (!this.newMeal.cat_id || !this.newMeal.user_id) {
      this.error = 'Le chat et l\'utilisateur sont obligatoires';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    this.apiService.createMeal(this.newMeal as MealCreate).subscribe({
      next: () => {
        this.resetForm();
        this.loadData();
      },
      error: (err) => {
        this.error = 'Impossible de créer le repas';
        this.isLoading = false;
        console.error('Error creating meal:', err);
      }
    });
  }

  resetForm(): void {
    this.newMeal = {
      cat_id: 0,
      user_id: this.selectedUser?.id || 0,
      fed_at: new Date().toISOString(),
      sachets_used: 1
    };
  }

  deleteMeal(mealId: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce repas ?')) {
      return;
    }

    this.apiService.deleteMeal(mealId).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        this.error = 'Impossible de supprimer le repas';
        console.error('Error deleting meal:', err);
      }
    });
  }

  applyFilters(): void {
    this.loadData();
  }

  resetFilters(): void {
    this.filterCatId = null;
    this.filterUserId = null;
    this.filterLimit = 50;
    this.loadData();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getCatName(catId: number): string {
    const cat = this.cats.find(c => c.id === catId);
    return cat ? cat.name : 'Inconnu';
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Inconnu';
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    
    const d = new Date(date);
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const dayName = days[d.getDay()];
    const day = String(d.getDate()).padStart(2, '0');
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${dayName} ${day} ${monthName} ${year}, ${hours}:${minutes}`;
  }
}
