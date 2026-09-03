import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  selectedUser: User | null = null;
  
  // Form fields
  newUserName = '';
  editUserId: number | null = null;
  editUserName = '';

  constructor(
    private apiService: ApiService,
    public userService: UserService
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

  createUser(): void {
    if (!this.newUserName.trim()) {
      this.error = 'Le nom de l\'utilisateur est obligatoire';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    this.apiService.createUser(this.newUserName).subscribe({
      next: () => {
        this.newUserName = '';
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'Impossible de créer l\'utilisateur';
        this.isLoading = false;
        console.error('Error creating user:', err);
      }
    });
  }

  startEdit(user: User): void {
    this.editUserId = user.id;
    this.editUserName = user.name;
  }

  cancelEdit(): void {
    this.editUserId = null;
    this.editUserName = '';
  }

  updateUser(): void {
    if (!this.editUserId || !this.editUserName.trim()) {
      this.error = 'Le nom de l\'utilisateur est obligatoire';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    // Note: In a real implementation, we would have a PUT endpoint for users
    // For now, we'll just reload the list
    this.apiService.getUsers().subscribe({
      next: () => {
        this.cancelEdit();
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'Impossible de modifier l\'utilisateur';
        this.isLoading = false;
        console.error('Error updating user:', err);
      }
    });
  }

  deleteUser(userId: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    // Note: In a real implementation, we would have a DELETE endpoint for users
    this.error = 'La suppression des utilisateurs n\'est pas encore implémentée dans l\'API';
  }

  selectUser(user: User): void {
    this.userService.setSelectedUser(user);
    this.selectedUser = user;
  }

  clearSelectedUser(): void {
    this.userService.clearSelectedUser();
    this.selectedUser = null;
  }

  // Safe navigation for templates
  get selectedUserName(): string {
    return this.selectedUser?.name || '';
  }
}
