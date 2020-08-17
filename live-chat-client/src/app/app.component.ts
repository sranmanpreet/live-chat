import { Component } from '@angular/core';
import { ChatService } from './shared/chat.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'live-chat-client';
  user: String;
  room: String = "";
  messageText: String;
  messageArray: Array<{ user: String, message: String }> = [];
  status: String = "Not Joined";
  constructor(private _chatService: ChatService) {
    this._chatService.newUserJoined()
      .subscribe(data => this.messageArray.push(data));


    this._chatService.userLeftRoom()
      .subscribe(data => this.messageArray.push(data));

    this._chatService.newMessageReceived()
      .subscribe(data => this.messageArray.push(data));
  }

  join() {
    this._chatService.joinRoom({ user: this.user, room: this.room });
    this.status = "Joined " + this.room;
    this.clearMessageBox();
  }

  leave() {
    this._chatService.leaveRoom({ user: this.user, room: this.room });
    this.status = "Not Joined";
    this.clearMessageBox();
  }

  sendMessage(f: NgForm) {
    const form = f.value;
    if(form.messageText && form.user && form.room){
      this.clearMessageBox();
      this._chatService.sendMessage({ user: form.user, room: form.room, message: form.messageText });
    }
  }

  clearMessageBox(){
    this.messageText = "";
  }
}
