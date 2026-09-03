import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.selectedUser = this.userService.getSelectedUser();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger les utilisateurs';
        this.isLoading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  onUserSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const userId = parseInt(selectElement.value);
    
    if (userId) {
      const selectedUser = this.users.find(u => u.id === userId);
      if (selectedUser) {
        this.selectedUser = selectedUser;
        this.userService.setSelectedUser(selectedUser);
      }
    } else {
      this.selectedUser = null;
      this.userService.clearSelectedUser();
    }
  }
}
