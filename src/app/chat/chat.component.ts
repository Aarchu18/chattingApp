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


  constructor(private chatService: ChatServiceService, private routes: Router) { }
  addChannels() {
    console.log("new Channel Name: " + this.newChannel);
    this.chatService.addChannels(this.newChannel).subscribe(response => {
      console.log("channel created " + JSON.stringify(response.sid));
    },
      error => {
        console.log(error);
      });
  }


  searchChannel() {
    this.chatService.searchChannel().subscribe(res => {
      for (let index = 0; index < res.channels.length; index++) {
        this.channelArray.push(res.channels[index].unique_name)
        this.arrayLength = this.channelArray.length;
        for (let index = 0; index < this.arrayLength; index++) {
          if (this.channelArray[index] == this.channel) {
            this.gotChannel = this.channel;
            this.getCId = res.channels[index].sid;
            break;
          }
          else {

            this.gotChannel = "not Getting Your Channel";
          }
        }
      }
    },
      err => {
        console.log(err);
      })
  }
  joinChannel() {
    console.log(this.getCId);
    this.chatService.joinChannel(this.getCId).subscribe(res => {
      console.log(res);
      this.routes.navigateByUrl('/RefrshComponent', { skipLocationChange: true }).then(() =>
        this.routes.navigate(["/chat"]));
    }, err => {
      console.log(err);

    })
  }
  // this.setinterval=setInterval(()=>{
  //   this.chatService.getAllMessages().subscribe(res=>{
  //     this.messages=res.messages;

  //   })
  // })


  sendMessage() {
    this.chatService.sendMessage(this.myMessages).subscribe(res => {
      console.log(res);
      //  this.chatService.getAllMessages(channelId);
      // setInterval("location.reload(true);", 500);
      // this.routes.navigateByUrl('/RefrshComponent', { skipLocationChange: true }).then(() =>
      // this.routes.navigate(["/chat"]));
    },
      err => {
        console.log(err);
      })


  }
channels:string="";
  getAllMessages(channelId) {
    this.getChannelName(channelId);
    this.allMessages = [];
    this.channels=channelId;

    this.chatService.getAllMessages(channelId).subscribe(res => {
      setInterval(() => {
        this.chatService.getAllMessages(this.channels).subscribe(res => {
          this.totalMessages = res.messages.length;
          for (let index = 0; index < this.totalMessages; index++) {
            if (res.messages[index].from == this.roleIdentity)
              this.allMessages[index] = { msg: res.messages[index].body, sender: true, senderId: res.messages[index].from }
            else
              this.allMessages[index] = { msg: res.messages[index].body, sender: false, senderId: res.messages[index].from }
          }
        }),
          err => {
            console.log(err);
          }
      }, 1000);

      err => {
        console.log(err);
      }

  })
}


  totalChannels = [];
  cSid: string;
  channelName: string;
  cSidList = [];
  listJoinedChannel() {
    this.chatService.searchChannel().subscribe(res => {
      console.log('res', res)
      this.totalChannels = res.channels;
      for (let index = 0; index < res.channels.length; index++) {
        this.cSid = res.channels[index].sid;

        this.cSidList[index] = (this.cSid);
      }

      this.userListInChannel(this.cSidList);
    })
  }
  myChannelList: Array<{ name: string, id: string }> = [];

  roleIdentity = this.chatService.identity;
  seperateChannelSid(res) {
    console.log(this.totalChannels, "this.totalChannerls");
    res.members.forEach((element1) => {

      if (this.roleIdentity == element1.identity) {

        this.totalChannels.forEach((elemet) => {
          if (element1.channel_sid == elemet.sid) {
            this.myChannelList.push({ name: elemet.unique_name, id: elemet.sid })
          }
        })

      }

    });
  }
  userListInChannel(channelList) {
    this.myChannelList = [];
    channelList.forEach(element => {
      this.chatService.getMembersOfChannel(element).subscribe(res => {
        this.seperateChannelSid(res)
      }, err => {
        console.log(err);
      })
    });
  }
  myChannelName: string = "";
  getChannelName(myChannelId) {
    this.chatService.getChannelDetail(myChannelId).subscribe(res => {
      console.log("channel detail", res);
      this.myChannelName = res.unique_name;

    });
  }
  signOut() {
    localStorage.clear();
    this.routes.navigate(['/']);
  }

  ngOnInit() {

    this.listJoinedChannel();
    this.getAllMessages("");
    // this.chatService.joinChannel("CHccf567cff42447bdab60f7dfdfe10aeb");

    this.userData = this.chatService.getData();

  }
}
