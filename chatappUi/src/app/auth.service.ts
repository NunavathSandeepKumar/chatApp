import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError , Observable,of} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient, private router: Router) { }

  signUp(signUpObj: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user`, signUpObj).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error.message); // Pass error message to component
      })
    )
  }

  login(loginObj: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, loginObj).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error.message); // Pass error message to component
      })
    )
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      // Handle scenario where refresh token is not available
      return;
    }

    // const headers = { 'Authorization': `Bearer ${refreshToken}` };
    this.http.post<any>(`${this.apiUrl}/token`, {refreshToken:refreshToken}).subscribe(res => {
      this.storeAccessToken(res.accessToken);
    });
  }

  storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  storeAccessToken(accessToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  logout() {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      this.clearTokensAndNavigateToLogin();
      return;
    }
    const headers = { 'Authorization': `Bearer ${accessToken}` };
    this.http.post<any>(`${this.apiUrl}/user/logout`, {}, { headers }).subscribe({
      next: () => {
        this.clearTokensAndNavigateToLogin();
      },
      error: () => {
        this.clearTokensAndNavigateToLogin();
      }
    });
  }

   clearTokensAndNavigateToLogin() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.router.navigate(['/login']);
  }
  

  isAuthenticated(): Observable<boolean> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.post<boolean>(`${this.apiUrl}/auth/verify`, {}, { headers }).pipe(
      catchError(() => {
        return of(false); // Token verification failed
      })
    );
  }
}
