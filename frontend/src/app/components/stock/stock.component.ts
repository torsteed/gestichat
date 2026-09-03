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

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.selectedUser = this.userService.getSelectedUser();
    
    if (this.selectedUser) {
      this.newStock.user_id = this.selectedUser.id;
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

  resetForm(): void {
    this.newStock = {
      sachets_added: 0,
      user_id: this.selectedUser?.id || 0,
      note: ''
    };
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
