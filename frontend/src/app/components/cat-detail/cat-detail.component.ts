import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Cat } from '../../models/cat.model';
import { Meal } from '../../models/meal.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-cat-detail',
  templateUrl: './cat-detail.component.html',
  styleUrls: ['./cat-detail.component.scss']
})
export class CatDetailComponent implements OnInit {
  cat: Cat | null = null;
  meals: Meal[] = [];
  isLoading = false;
  error: string | null = null;
  selectedUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const catId = this.route.snapshot.paramMap.get('id');
    if (catId) {
      this.loadCatDetail(parseInt(catId));
    }
    this.selectedUser = this.userService.getSelectedUser();
  }

  loadCatDetail(catId: number): void {
    this.isLoading = true;
    this.error = null;
    
    Promise.all([
      this.apiService.getCats().toPromise(),
      this.apiService.getCatMeals(catId).toPromise()
    ]).then(([cats, meals]) => {
      const foundCat = cats?.find(c => c.id === catId);
      if (foundCat) {
        this.cat = foundCat;
        this.meals = meals || [];
      } else {
        this.error = 'Chat non trouvé';
      }
      this.isLoading = false;
    }).catch((err) => {
      this.error = 'Impossible de charger les détails du chat';
      this.isLoading = false;
      console.error('Error loading cat detail:', err);
    });
  }

  quickAddMeal(): void {
    if (!this.cat) return;
    
    const user = this.userService.getSelectedUser();
    if (!user) {
      this.error = 'Veuillez sélectionner un utilisateur avant d\'ajouter un repas';
      return;
    }

    const mealData = {
      cat_id: this.cat.id,
      user_id: user.id,
      fed_at: new Date().toISOString(),
      sachets_used: 1
    };

    this.apiService.createMeal(mealData).subscribe({
      next: () => {
        this.loadCatDetail(this.cat!.id);
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
        this.loadCatDetail(this.cat!.id);
      },
      error: (err) => {
        this.error = 'Impossible de supprimer le repas';
        console.error('Error deleting meal:', err);
      }
    });
  }

  // Safe navigation for templates
  get catName(): string {
    return this.cat?.name || '';
  }
  
  get catId(): number {
    return this.cat?.id || 0;
  }
  
  get catActive(): boolean {
    return this.cat?.active || false;
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
