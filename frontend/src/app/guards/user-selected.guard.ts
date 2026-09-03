import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserSelectedGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.userService.isUserSelected()) {
      return true;
    }
    
    // Redirect to dashboard if no user is selected
    this.router.navigate(['/']);
    return false;
  }
}
