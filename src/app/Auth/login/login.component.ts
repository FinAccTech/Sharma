import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/globals.service';
import { AuthService } from '../auth.service';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@AutoUnsubscribe
export class LoginComponent {
  StatusMode: boolean = false;
  StatusText: string = "";
  StatusError: boolean = false;
  constructor(private router: Router, private globals: GlobalsService, private auth: AuthService ){

  }

  UserName: string = ""
  Password: string = ""

  ngOnInit(){
    
    const SessionLogged: number = +sessionStorage.getItem("logged")!; 
    if (SessionLogged == 1){
      this.auth.authenticated = true;
      this.auth.Loggeduser = sessionStorage.getItem("loggeduser")!;
      this.auth.UserType = +sessionStorage.getItem("usertype")!;
      this.auth.LoggedUserSno = +sessionStorage.getItem("selectedusersno")!;
      this.router.navigate(['dashboard']);      
    }    
  }

  Login(){
    this.StatusText = "Checking...."
    this.StatusMode = true;
    this.StatusError = false;

    this.auth.CheckLogin(this.UserName, this.Password).subscribe( data =>{

      
      if (data.queryStatus == 0){
          this.StatusError = true;
          this.StatusText = data.apiData;
      }
      else{        
        if ( JSON.parse (data.apiData).length > 0){

          const UserSno: number = JSON.parse(data.apiData)[0].UserSno;

          if (!UserSno || UserSno == 0){
            this.StatusError = true;
            this.StatusText = "Invalid Login Credentials....";
            return;
          }

          this.StatusText = "Valid User";
          this.auth.authenticated = true;
          this.auth.Loggeduser = this.UserName;          
          this.auth.LoggedUserSno = UserSno;
          this.auth.UserType = JSON.parse(data.apiData)[0].User_Type;
          
          sessionStorage.setItem("logged","1");
          sessionStorage.setItem("loggeduser",this.UserName);
          sessionStorage.setItem("usertype",this.auth.UserType.toString());
          sessionStorage.setItem("selectedusersno",UserSno.toString());
          
          this.router.navigate(['dashboard']);      
        }
        else
        {
          this.StatusError = true;
          this.StatusText = "Invalid Login Credentials....";
        }
      }
    })    
  }
}
