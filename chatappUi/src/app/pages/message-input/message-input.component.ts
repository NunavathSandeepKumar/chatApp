import { Component } from '@angular/core';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent {
  messageContent: string = '';

  constructor(private chatService: ChatService) { }

  sendMessage() {
    if (this.messageContent.trim() !== '') {
      this.chatService.sendMessage(this.messageContent,"6637d27dd5774a135b47d053").subscribe((res: any) => {
       console.log(res)
      });
      this.messageContent = '';
    }
  }
}
