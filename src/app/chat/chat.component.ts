import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from '../chat-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  channel: string = "";
  gotChannel = "";
  channelArray: any = [];
  getCId = "";
  arrayLength;
  userData: any;
  allMessages = [];
  totalMessages: number;
  myMessages: string;
  newChannel: string;
  name = localStorage.getItem("name");
  image = localStorage.getItem("image");
  totalChannels = [];
  cSid: string;
  channelName: string;
  cSidList = [];
  myCName: string = "";


  constructor(private chatService: ChatServiceService, private routes: Router) { }
  addChannels() {
    console.log("new Channel Name: " + this.newChannel);
    this.chatService.addChannels(this.newChannel).subscribe(response => {
      console.log("channel created " + JSON.stringify(response.sid));
    },
      error => {
        alert("Channel Already Exist!!");
        console.log(error);
      });
  }


  searchChannel() {
    this.chatService.searchChannel().subscribe(response => {
      for (let index = 0; index < response.channels.length; index++) {
        this.channelArray.push(response.channels[index].unique_name)
        this.arrayLength = this.channelArray.length;
        for (let index = 0; index < this.arrayLength; index++) {
          if (this.channelArray[index] == this.channel) {
            this.gotChannel = this.channel;
            
            this.getCId = response.channels[index].sid;
            break;
          }
          else {

            this.gotChannel = "not Getting Your Channel";
          }
        }
      }
    },
      error => {
        console.log(error);
      })
  }
  joinChannel() {
    console.log(this.getCId);
    this.chatService.joinChannel(this.getCId).subscribe(response => {
      console.log(response);
      this.routes.navigateByUrl('/RefrshComponent', { skipLocationChange: true }).then(() =>
        this.routes.navigate(["/chat"]));
        alert("Please join the channel!!");
    }, error => {
      alert("You already joined the channel!!");
      console.log(error);

    })
  }



  sendMessage() {
    this.chatService.sendMessage(this.myMessages).subscribe(response => {
      console.log(response);

    },
      error => {
        console.log(error);
      })


  }
  channels: string = "";
  getAllMessages(cId) {
    this.getChannelName(cId);
    this.allMessages = [];
    this.channels = cId;

    this.chatService.getAllMessages(cId).subscribe(response => {
      setInterval(() => {
        this.chatService.getAllMessages(this.channels).subscribe(response => {
          this.totalMessages = response.messages.length;
          for (let index = 0; index < this.totalMessages; index++) {
            if (response.messages[index].from == this.roleId)
              this.allMessages[index] = { msg: response.messages[index].body, sender: true, senderId: response.messages[index].from }
            else
              this.allMessages[index] = { msg: response.messages[index].body, sender: false, senderId: response.messages[index].from }
          }
        }),
          error => {
            console.log(error);
          }
      }, 1000);

      error => {
        console.log(error);
      }

    })
  }
  listJoinedChannel() {
    this.chatService.searchChannel().subscribe(response => {
      console.log('response', response)
      this.totalChannels = response.channels;
      for (let index = 0; index < response.channels.length; index++) {
        this.cSid = response.channels[index].sid;

        this.cSidList[index] = (this.cSid);
      }

      this.userListInChannel(this.cSidList);
    })
  }
  myChannelList: Array<{ name: string, id: string }> = [];

  roleId = this.chatService.identity;
  seperateChannelSid(response) {
    console.log(this.totalChannels, "this.totalChannels");
    response.members.forEach((element1) => {

      if (this.roleId == element1.identity) {

        this.totalChannels.forEach((element) => {
          if (element1.channel_sid == element.sid) {
            this.myChannelList.push({ name: element.unique_name, id: element.sid })
          }
        })

      }

    });
  }
  userListInChannel(channelList) {
    this.myChannelList = [];
    channelList.forEach(element => {
      this.chatService.getMembersOfChannel(element).subscribe(response => {
        this.seperateChannelSid(response)
      }, error => {
        console.log(error);
      })
    });
  }
  
  getChannelName(myCId) {
    this.chatService.getChannelDetail(myCId).subscribe(response => {
      console.log("channel detail", response);
      this.myCName = response.unique_name;

    });
  }
  signOut() {
    localStorage.clear();
    this.routes.navigate(['/']);
  }

  ngOnInit() {

    this.listJoinedChannel();
    this.getAllMessages("");
    this.userData = this.chatService.getData();

  }
}
