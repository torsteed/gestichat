import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Cat } from '../models/cat.model';
import { Meal, MealCreate } from '../models/meal.model';
import { Stock, StockCreate, StockCurrent } from '../models/stock.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client error:', error.error.message);
    } else {
      // Server-side error
      console.error(`Server returned code: ${error.status}, message: ${error.message}`);
    }
    return throwError(() => new Error('Une erreur est survenue. Veuillez réessayer plus tard.'));
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(name: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, { name }, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Cats
  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${this.apiUrl}/cats`).pipe(
      catchError(this.handleError)
    );
  }

  createCat(name: string, active: boolean = true): Observable<Cat> {
    return this.http.post<Cat>(`${this.apiUrl}/cats`, { name, active }, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateCat(id: number, name: string, active: boolean): Observable<Cat> {
    return this.http.put<Cat>(`${this.apiUrl}/cats/${id}`, { name, active }, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Meals
  getMeals(limit?: number, catId?: number, userId?: number): Observable<Meal[]> {
    let url = `${this.apiUrl}/meals`;
    const params: string[] = [];
    
    if (limit) params.push(`limit=${limit}`);
    if (catId) params.push(`catId=${catId}`);
    if (userId) params.push(`userId=${userId}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<Meal[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  createMeal(meal: MealCreate): Observable<Meal> {
    return this.http.post<Meal>(`${this.apiUrl}/meals`, meal, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteMeal(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/meals/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getCatMeals(catId: number): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.apiUrl}/cats/${catId}/meals`).pipe(
      catchError(this.handleError)
    );
  }

  // Dashboard endpoints
  getLatestMealsByCat(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard/latest-meals-by-cat`).pipe(
      catchError(this.handleError)
    );
  }

  getRecentMeals(limit: number = 20): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.apiUrl}/dashboard/recent-meals?limit=${limit}`).pipe(
      catchError(this.handleError)
    );
  }

  // Stock
  getCurrentStock(): Observable<StockCurrent> {
    return this.http.get<StockCurrent>(`${this.apiUrl}/stock/current`).pipe(
      catchError(this.handleError)
    );
  }

  getStockHistory(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/history`).pipe(
      catchError(this.handleError)
    );
  }

  addStock(stock: StockCreate): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}/stock`, stock, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
