import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,of,interval} from 'rxjs';
import { catchError ,switchMap, startWith  } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}
  // Function to get messages
  getMessages(chatId:string): Observable<any> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      // Handle scenario where access token is not available
      return of([]);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any[]>(
      `${this.apiUrl}/message/${chatId}`,
      { headers }
    );
  }
  // getMessagesWithPolling(chatId: string): Observable<any[]> {
  //   return interval(1000) // Poll every 5 seconds (adjust as needed)
  //     .pipe(
  //       startWith(0), // Start immediately
  //       switchMap(() => this.getMessages(chatId)) // Use existing getMessages method
  //     );
  // }
  // Function to send a message
  sendMessage(content: string,chatId:string): Observable<any> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      // Handle scenario where access token is not available
      return of([]);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });

    const data = {
      content: content,
      chatId: chatId, 
    };

    return this.http.post<any>(`${this.apiUrl}/message`, data, { headers });
  }
  // create chat
  createChat(userId: string): Observable<any> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      // Handle scenario where access token is not available
      return of([]);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });

    const data = {
      userId: userId,
    };
    return this.http.post<any>(`${this.apiUrl}/chat'`, data, { headers }).pipe(
      catchError((error) => {
        // Handle error
        return of(null);
      })
    );
  }
  getChats(): Observable<any> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      // Handle scenario where access token is not available
      return of([]);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/chat`, { headers }).pipe(
      catchError((error) => {
        // Handle error
        return of([]);
      })
    );
  }
  createGroupChat(name: string, users: string[]): Observable<any> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      // Handle scenario where access token is not available
      return of([]);
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
  
    const data = {
      name: name,
      users: JSON.stringify(users),
    };
    return this.http.post<any>(`${this.apiUrl}/chat/group`, data, { headers }).pipe(
      catchError((error) => {
        // Handle error
        return of(null);
      })
    );
  }  
  addToGroupChat(chatId: string, userId: string): Observable<any> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      // Handle scenario where access token is not available
      return of([]);
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
  
    const data = {
      chatId: chatId,
      userId: userId,
    };
  
    return this.http.put<any>(`${this.apiUrl}/chat/addtogroup`, data, { headers }).pipe(
      catchError((error) => {
        // Handle error
        return of(null);
      })
    );
  }
  removeFromGroupChat(chatId: string, userId: string): Observable<any> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      // Handle scenario where access token is not available
      return of([]);
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
  
    const data = {
      chatId: chatId,
      userId: userId,
    };
  
    return this.http.put<any>(`${this.apiUrl}/chat/groupuserremove`, data, { headers }).pipe(
      catchError((error) => {
        // Handle error
        return of(null);
      })
    );
  }
  getUserDetails(userId: string): Observable<any> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      // Handle scenario where access token is not available
      return of(null);
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get<any>(`${this.apiUrl}/user/users`, { 
      headers,
      params: { userId: userId }
    }).pipe(
      catchError((error) => {
        // Handle error
        return of(null);
      })
    );
  }
  getAllUsers(): Observable<any> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      // Handle scenario where access token is not available
      return of([]);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/user/users`, { headers }).pipe(
      catchError((error) => {
        // Handle error
        return of([]);
      })
    );
  }
}
