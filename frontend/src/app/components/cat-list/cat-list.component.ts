import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Cat } from '../../models/cat.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-cat-list',
  templateUrl: './cat-list.component.html',
  styleUrls: ['./cat-list.component.scss']
})
export class CatListComponent implements OnInit {
  cats: Cat[] = [];
  isLoading = false;
  error: string | null = null;
  selectedUser: User | null = null;
  
  // Form fields
  newCatName = '';
  editCatId: number | null = null;
  editCatName = '';
  editCatActive = true;

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadCats();
    this.selectedUser = this.userService.getSelectedUser();
  }

  loadCats(): void {
    this.isLoading = true;
    this.error = null;
    
    this.apiService.getCats().subscribe({
      next: (cats) => {
        this.cats = cats;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger les chats';
        this.isLoading = false;
        console.error('Error loading cats:', err);
      }
    });
  }

  createCat(): void {
    if (!this.newCatName.trim()) {
      this.error = 'Le nom du chat est obligatoire';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    this.apiService.createCat(this.newCatName, true).subscribe({
      next: () => {
        this.newCatName = '';
        this.loadCats();
      },
      error: (err) => {
        this.error = 'Impossible de cr\u00e9er le chat';
        this.isLoading = false;
        console.error('Error creating cat:', err);
      }
    });
  }

  startEdit(cat: Cat): void {
    this.editCatId = cat.id;
    this.editCatName = cat.name;
    this.editCatActive = cat.active;
  }

  cancelEdit(): void {
    this.editCatId = null;
    this.editCatName = '';
    this.editCatActive = true;
  }

  updateCat(): void {
    if (!this.editCatId || !this.editCatName.trim()) {
      this.error = 'Le nom du chat est obligatoire';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    this.apiService.updateCat(this.editCatId, this.editCatName, this.editCatActive).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadCats();
      },
      error: (err) => {
        this.error = 'Impossible de modifier le chat';
        this.isLoading = false;
        console.error('Error updating cat:', err);
      }
    });
  }

  deleteCat(catId: number): void {
    if (!confirm('\u00cates-vous s\u00fbr de vouloir supprimer ce chat ?')) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    this.apiService.deleteCat(catId).subscribe({
      next: () => {
        this.loadCats();
      },
      error: (err) => {
        this.error = 'Impossible de supprimer le chat';
        this.isLoading = false;
        console.error('Error deleting cat:', err);
      }
    });
  }

  quickAddMeal(catId: number): void {
    const user = this.userService.getSelectedUser();
    if (!user) {
      this.error = 'Veuillez s\u00e9lectionner un utilisateur avant d\'ajouter un repas';
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
        // Meal created, could refresh data or show success
      },
      error: (err) => {
        this.error = 'Impossible d\'ajouter le repas';
        console.error('Error adding meal:', err);
      }
    });
  }
}
