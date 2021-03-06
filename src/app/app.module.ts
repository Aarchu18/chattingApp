import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from "angular-6-social-login";
import { SignInComponent } from './sign-in/sign-in.component';
import { ChatComponent } from './chat/chat.component';
import { ChatServiceService } from './chat-service.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import{AuthServiceService} from  './auth-service.service';



export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [

      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("223287134681-ttbua9pekt3i80jqvhhco3e6m12897di.apps.googleusercontent.com")
      },

    ]);

  return config;
}
const routes: Routes = [{
  path: '',
  component: SignInComponent
},
{
  path:'chat',
  canActivate:[AuthServiceService],

  component: ChatComponent,
},
  
{
  path: "**",
  component:SignInComponent
}
];
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    ChatComponent,
  

  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthServiceService,
    ChatServiceService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
