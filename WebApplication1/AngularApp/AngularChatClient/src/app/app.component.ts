import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HubConnection,HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'AngularChatClient';

  public Messages: ChatMessage[] = [];

  private connection!: HubConnection;
  public user!: string;
  public message: string = "";

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl('https://localhost:7145/chat')
      .build();
  }


  async ngOnInit() {

    this.user = prompt('Enter your name...', 'DITC') ?? 'DITC';

    this.connection.on('msgRcv', (user, message) => {

      this.Messages.push(new ChatMessage(user, message));
    });

    this.connection.on('imgRcv', (user, img) => {

      this.Messages.push(new ChatMessage(user, img, false));
    });



    try {
      await this.connection.start();
      console.log('Connected to SignalR hub');
    } catch (error) {
      console.error('Failed to connect to SignalR hub', error);
    }
  }
  async sendMessage() {

    if (!this.message) return;

    await this.connection.invoke('TextShare', this.user, this.message);
    this.message = '';
  }

  async sendFile(event: any) {
 
    const file: File = event.target.files[0];

    var baseData = await this.getBase64(file);
    await this.connection.invoke('ImageShare', this.user, baseData);

  }
  getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);

    });
  }


}

export class ChatMessage {

  constructor(public UserName: string, public Message: string, public IsText: boolean = true)
  {

  }


}
