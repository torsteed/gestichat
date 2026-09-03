import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'gestichat_selected_user';

  constructor() { }

  setSelectedUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  getSelectedUser(): User | null {
    const userJson = localStorage.getItem(this.STORAGE_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  clearSelectedUser(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isUserSelected(): boolean {
    return this.getSelectedUser() !== null;
  }
}
