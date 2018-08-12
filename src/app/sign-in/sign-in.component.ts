import { Component, OnInit } from '@angular/core';
import { SocialLoginModule, AuthService, GoogleLoginProvider } from "angular-6-social-login";
import { ChatServiceService } from '../chat-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private socialAuthService: AuthService, private chatService: ChatServiceService, private routes: Router) { }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    // else if (socialPlatform == "twitter") {
    //   socialPlatformProvider = TwitterLoginProvider.PROVIDER_ID;
    // }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + " sign in data : ", userData.name,userData);
        localStorage.setItem("Identity",userData.email);
        localStorage.setItem("id",userData.id);
        localStorage.setItem("name",userData.name);
        localStorage.setItem("image",userData.image);
        
        // Now sign-in with userDatauser
        // // ...
        // this.chatService.setData(userData);
        this.routes.navigate(['/chat']);
      }
    );
  }
  authentication() {
    this.chatService.setJsonData().subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
  }
  ngOnInit() {
  }

}
