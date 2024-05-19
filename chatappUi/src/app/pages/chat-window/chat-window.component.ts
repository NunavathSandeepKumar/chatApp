import { Component } from '@angular/core';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
})
export class ChatWindowComponent {
  messages: any[] = [];
  chatName: any; 
  constructor(private chatService: ChatService) { }

  
  ngOnInit(): void {
    this.loadMessages();
  }

  // Load initial messages
  loadMessages() {
    this.chatService.getMessages("6637d27dd5774a135b47d053").subscribe((res: any) => {
      this.messages = res;
      this.chatName = res[0].chat.chatName;
    });
  }
}
