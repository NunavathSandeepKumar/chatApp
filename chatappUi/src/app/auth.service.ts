import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError , Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/user';
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient, private router: Router) { }

  signUp(signUpObj: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, signUpObj).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error.message); // Pass error message to component
      })
    )
  }

  login(loginObj: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginObj).pipe(
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

  private storeAccessToken(accessToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  isAuthenticated(): boolean {
    // Check if access token is present
    return !!this.getAccessToken();
  }
}
