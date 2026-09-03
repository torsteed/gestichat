import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Cat } from '../../models/cat.model';
import { User } from '../../models/user.model';
import { MealCreate } from '../../models/meal.model';

@Component({
  selector: 'app-meal-create',
  templateUrl: './meal-create.component.html',
  styleUrls: ['./meal-create.component.scss']
})
export class MealCreateComponent implements OnInit {
  cats: Cat[] = [];
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  selectedUser: User | null = null;

  // Form fields
  selectedCatIds: number[] = [];
  selectedUserId: number | null = null;
  selectedDateTime: string = new Date().toISOString().slice(0, 16);
  sachetsUsed: number = 1;

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.selectedUser = this.userService.getSelectedUser();
    if (this.selectedUser) {
      this.selectedUserId = this.selectedUser.id;
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    Promise.all([
      this.apiService.getCats().toPromise(),
      this.apiService.getUsers().toPromise()
    ]).then(([cats, users]) => {
      this.cats = cats || [];
      this.users = users || [];
      this.isLoading = false;
    }).catch((err) => {
      this.error = 'Impossible de charger les données';
      this.isLoading = false;
      console.error('Error loading data:', err);
    });
  }

  onCatSelected(catId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.selectedCatIds.includes(catId)) {
        this.selectedCatIds.push(catId);
      }
    } else {
      this.selectedCatIds = this.selectedCatIds.filter(id => id !== catId);
    }
  }

  createMeals(): void {
    if (this.selectedCatIds.length === 0) {
      this.error = 'Veuillez sélectionner au moins un chat';
      return;
    }

    if (!this.selectedUserId) {
      this.error = 'Veuillez sélectionner un utilisateur';
      return;
    }

    if (!this.selectedDateTime) {
      this.error = 'Veuillez sélectionner une date et heure';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = null;

    // Create a meal for each selected cat
    const promises: Promise<any>[] = [];

    for (const catId of this.selectedCatIds) {
      const mealData: MealCreate = {
        cat_id: catId,
        user_id: this.selectedUserId,
        fed_at: new Date(this.selectedDateTime).toISOString(),
        sachets_used: this.sachetsUsed
      };
      promises.push(
        this.apiService.createMeal(mealData).toPromise()
      );
    }

    Promise.all(promises)
      .then(() => {
        this.success = `${this.selectedCatIds.length} repas créé(s) avec succès !`;
        this.isLoading = false;
        // Reset form
        this.selectedCatIds = [];
        // Keep user selection but reset others
        this.selectedDateTime = new Date().toISOString().slice(0, 16);
        this.sachetsUsed = 1;
      })
      .catch((err) => {
        this.error = 'Impossible de créer les repas';
        this.isLoading = false;
        console.error('Error creating meals:', err);
      });
  }

  // Helper to check if a cat is selected
  isCatSelected(catId: number): boolean {
    return this.selectedCatIds.includes(catId);
  }

  // Get active cats only
  get activeCats(): Cat[] {
    return this.cats.filter(cat => cat.active);
  }
}
