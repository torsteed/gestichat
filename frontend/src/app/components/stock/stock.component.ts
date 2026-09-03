import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Stock, StockCreate, StockCurrent } from '../../models/stock.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  stockHistory: Stock[] = [];
  currentStock: StockCurrent | null = null;
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  selectedUser: User | null = null;
  stockThreshold = 10;
  
  // Form fields for adding stock
  newStock = {
    sachets_added: 0,
    user_id: 0,
    note: ''
  };

  // Form fields for removing stock
  removeStockForm = {
    sachets_removed: 0,
    user_id: 0,
    note: ''
  };

  // Form fields for setting stock
  setStockForm = {
    new_value: 0,
    user_id: 0,
    note: ''
  };

  showRemoveForm = false;
  showSetForm = false;

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.selectedUser = this.userService.getSelectedUser();
    
    if (this.selectedUser) {
      this.newStock.user_id = this.selectedUser.id;
      this.removeStockForm.user_id = this.selectedUser.id;
      this.setStockForm.user_id = this.selectedUser.id;
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    
    Promise.all([
      this.apiService.getStockHistory().toPromise(),
      this.apiService.getCurrentStock().toPromise(),
      this.apiService.getUsers().toPromise()
    ]).then(([history, current, users]) => {
      this.stockHistory = history || [];
      this.currentStock = current || { currentStock: 0 };
      this.users = users || [];
      this.isLoading = false;
    }).catch((err) => {
      this.error = 'Impossible de charger les données de stock';
      this.isLoading = false;
      console.error('Error loading stock data:', err);
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

  addStock(): void {
    if (!this.newStock.sachets_added || this.newStock.sachets_added <= 0) {
      this.error = 'La quantité doit être supérieure à 0';
      return;
    }
    
    if (!this.newStock.user_id) {
      this.error = 'Veuillez sélectionner un utilisateur';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    this.apiService.addStock(this.newStock as StockCreate).subscribe({
      next: () => {
        this.resetForm();
        this.loadData();
      },
      error: (err) => {
        this.error = 'Impossible d\'ajouter le stock';
        this.isLoading = false;
        console.error('Error adding stock:', err);
      }
    });
  }

  removeStock(): void {
    if (!this.removeStockForm.sachets_removed || this.removeStockForm.sachets_removed <= 0) {
      this.error = 'La quantité doit être supérieure à 0';
      return;
    }
    
    if (!this.removeStockForm.user_id) {
      this.error = 'Veuillez sélectionner un utilisateur';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    this.apiService.removeStock(
      this.removeStockForm.sachets_removed,
      this.removeStockForm.user_id,
      this.removeStockForm.note
    ).subscribe({
      next: () => {
        this.resetRemoveForm();
        this.loadData();
      },
      error: (err) => {
        this.error = 'Impossible de retirer du stock';
        this.isLoading = false;
        console.error('Error removing stock:', err);
      }
    });
  }

  setStock(): void {
    if (this.setStockForm.new_value === undefined) {
      this.error = 'Veuillez définir une valeur valide';
      return;
    }
    
    if (!this.setStockForm.user_id) {
      this.error = 'Veuillez sélectionner un utilisateur';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    this.apiService.setStock(
      this.setStockForm.new_value,
      this.setStockForm.user_id,
      this.setStockForm.note
    ).subscribe({
      next: () => {
        this.resetSetForm();
        this.loadData();
      },
      error: (err) => {
        this.error = 'Impossible de définir le stock';
        this.isLoading = false;
        console.error('Error setting stock:', err);
      }
    });
  }

  toggleRemoveForm(): void {
    this.showRemoveForm = !this.showRemoveForm;
    if (this.showRemoveForm) {
      this.showSetForm = false;
      this.resetRemoveForm();
    }
  }

  toggleSetForm(): void {
    this.showSetForm = !this.showSetForm;
    if (this.showSetForm) {
      this.showRemoveForm = false;
      this.resetSetForm();
    }
  }

  resetForm(): void {
    this.newStock = {
      sachets_added: 0,
      user_id: this.selectedUser?.id || 0,
      note: ''
    };
  }

  resetRemoveForm(): void {
    this.removeStockForm = {
      sachets_removed: 0,
      user_id: this.selectedUser?.id || 0,
      note: ''
    };
    this.showRemoveForm = false;
  }

  resetSetForm(): void {
    this.setStockForm = {
      new_value: this.currentStock?.currentStock || 0,
      user_id: this.selectedUser?.id || 0,
      note: ''
    };
    this.showSetForm = false;
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Inconnu';
  }

  getTotalAdded(): number {
    return this.stockHistory.reduce((sum: number, s: any) => sum + s.sachets_added, 0);
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
