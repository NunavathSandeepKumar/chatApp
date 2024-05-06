import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  chats: any[] = [];

  constructor(private http: HttpClient, private authService:AuthService ) { }

  ngOnInit(): void {
    this.getChats();
  }
  getChats() {
    // Replace 'ChatAPI' with your actual API endpoint
    const accessToken = this.authService.getAccessToken();
    const headers = { 'Authorization': `Bearer ${accessToken}` };
    this.http.get<any>('http://localhost:3000/api/chat', { headers }).subscribe(
      (response) => {
        this.chats = response;
      },
      (error) => {
        console.error('Error fetching chats:', error);
      }
    );

  }

  formatTimeDifference(updatedAt: string): string {
    const updatedTime = new Date(updatedAt).getTime();
    const currentTime = Date.now();
    const timeDifference = currentTime - updatedTime;
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    return hoursDifference + 'h ' + minutesDifference + 'm';
  }
}
