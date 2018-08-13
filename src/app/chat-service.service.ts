import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  constructor(private http: HttpClient) { }
  serviceId: string = "ISca8ee418a80c4f07a2a21bce214ccc09";
  data: any;
  chennalList: any;
  channelId: string = "CHccf567cff42447bdab60f7dfdfe10aeb";
  identity: string = localStorage.getItem("Identity");
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic QUM1NWIxYWMwZDc2MWNjMjdkOWM0YmUyNjlkNGQ4NDljYzo3NjE2NjgxMTE3YzMwODQ5OGNhOTlkNWRkMGVhZmVmYw=="
    })
  }

  getData(): any {
    return this.data;
  }
  setData(data): void {
    this.data = data;
  }

  setJsonData(): Observable<any> {
    return this.http.post("https://chat.twilio.com/v2/Services", "FriendlyName=chattingApp", this.httpOptions);
  }
  addChannels(newChannel): Observable<any> {
    return this.http.post("https://chat.twilio.com/v2/Services/" + this.serviceId + "/Channels", "FriendlyName=chattingApp&UniqueName=" + newChannel, this.httpOptions);
  }

  searchChannel(): Observable<any> {

    return this.http.get("https://chat.twilio.com/v2/Services/" + this.serviceId + "/Channels", this.httpOptions).pipe(map(data => data));
  }

  joinChannel(cId): Observable<any> {

    return this.http.post("https://chat.twilio.com/v2/Services/" + this.serviceId + "/Channels/" + cId + "/Members", "ChannelSid=" + cId + "&Identity=" + this.identity + "&ServiceSid=" + this.serviceId, this.httpOptions);
  }

  sendMessage(myMessages): Observable<any> {
    return this.http.post("https://chat.twilio.com/v2/Services/" + this.serviceId + "/Channels/" + this.messageCId + "/Messages", "ChannelSid=" + this.channelId + "&ServiceSid=" + this.serviceId + "&Body=" + myMessages + "&From=" + this.identity, this.httpOptions);
  }
  messageCId:string;

  getAllMessages(cId): Observable<any> {
    this.messageCId=cId;
    return this.http.get("https://chat.twilio.com/v2/Services/" + this.serviceId + "/Channels/" +cId + "/Messages", this.httpOptions).pipe(map(data => data));
  }
  getMembersOfChannel(myCId):Observable<any>{
    return this.http.get("https://chat.twilio.com/v2/Services/"+this.serviceId+"/Channels/"+myCId+"/Members",this.httpOptions);
  }
  getChannelDetail(myCId):Observable<any>{
    return this.http.get("https://chat.twilio.com/v2/Services/"+this.serviceId+"/Channels/"+myCId,this.httpOptions).pipe(map(data=>data));
  }
}