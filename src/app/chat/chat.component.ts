import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  channel: string = "";
  foundChannel = "";
  channelArray: any = [];
  getChannelId = "";
  arrayLength;
  userData: any;
  allMessages = [];
  totalMessages: number;
  myMessages: string;

  constructor(private chatService: ChatServiceService) { }
  newChannel: string;
  addChannels() {
    console.log("new Channel Name: " + this.newChannel);
    this.chatService.addChannels(this.newChannel).subscribe(res => {
      console.log("channel created " + JSON.stringify(res.sid));
    },
      err => {
        console.log(err);
      });
   }


  searchChannel() {
    this.chatService.searchChannel().subscribe(res => {
      console.log("res value" + (res.channels[1].unique_name));
      console.log("length" + res.channels.length);
      for (let index = 0; index < res.channels.length; index++) {
        console.log("array " + (res.channels[index].sid));
        this.channelArray.push(res.channels[index].unique_name)
        console.log("channel array: " + this.channelArray);
        console.log("channel name: " + this.channel);
        this.arrayLength = this.channelArray.length;
        for (let index = 0; index < this.arrayLength; index++) {
          if (this.channelArray[index] == this.channel) {
            console.log("channel Got");
            this.foundChannel = this.channel;
            this.getChannelId = res.channels[index].sid;
            break;
          }
          else {
            console.log("not Getting the channel");
            this.foundChannel = "channel not found";
          }
        }
      }
    },
      err => {
        console.log(err);
      })
  }
  joinChannel() {
    console.log(this.getChannelId);
    this.chatService.joinChannel(this.getChannelId).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    })
  }
 
 
  sendMessage() {
    this.chatService.sendMessage(this.myMessages).subscribe(res => {
      console.log(res);
      setTimeout("location.reload(true);",1000);
    },
      err => {
        console.log(err);
      })
  }

  getAllMessages() {
    this.chatService.getAllMessages().subscribe(res => {
      this.allMessages = res.messages;
    },


      err => {
        console.log(err);
      })
  }

  ngOnInit() {
    this.getAllMessages();
    this.userData = this.chatService.getData();

  }

}
