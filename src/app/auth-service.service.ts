import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService implements CanActivate {

  constructor(private route: Router) { }
  canActivate()
  {
    if(localStorage.getItem('Identity')!=null)
    {
      return true;
    }
    else
    {
      this.route.navigate(['/']);

     return  false;
    }
  }
}
