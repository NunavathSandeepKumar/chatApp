import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObj: any = {
    "Email":"",
    "Password":""
  }
  constructor(private http:HttpClient){}
  
  onlogin(){
    this.http.post('http://localhost:4000/login',this.loginObj).subscribe( (res:any)=>{
      console.log(res);
    })
  }
  signUp(){
    this.http.post('http://localhost:4000/signup',this.loginObj).subscribe( (res:any)=>{
      console.log(res);
    })
  }
}
 