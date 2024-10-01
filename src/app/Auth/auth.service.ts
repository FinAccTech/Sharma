import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalsService } from '../globals.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient, private router: Router, private globals: GlobalsService ) { }
  // Http Options
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    }),
  };
 
  authenticated: boolean = false;
  CompSelected: boolean = false;
  
  Loggeduser: string = "";
  LoggedUserSno: number = 0;
  UserType: number = 0;
  ClientSno: number = 0;
  SelectedCompSno: number = 0;
  SelectedCompName: string = "";


  CheckLogin(username: string,password: string): Observable<any> 
  {          
    let edata: string =JSON.stringify({"UserName" :  username , "Password" : password }); 
    
     let params = new HttpParams()
     .set('data', edata)
         
     let apiURL: string = this.globals.baseApiURL + '/checkUser';
         
    return this.http.get<any>(apiURL, { params })
        .pipe(map(datarecd => {                      
            return ( datarecd);                        
        }));
  }   


  ListCompanies(UserSno: number): Observable<any>
    {      
      let edata: string =JSON.stringify({"UserSno": UserSno}); 
      
       let params = new HttpParams()
       .set('data', edata)             
       let apiURL: string = this.globals.baseApiURL + '/getCompanies';      
       return this.http.get<any>(apiURL, { params })
          .pipe(map(datarecd => {               
            return JSON.parse (datarecd.apiData)
          }));  
    }

    GetCompaniesList(UserSno: number): Observable<any>
    {      
      let edata: string =JSON.stringify({"UserSno": UserSno}); 
      
       let params = new HttpParams()
       .set('data', edata)             
       let apiURL: string = this.globals.baseApiURL + '/getCompanies';      
      
       return this.http.get<any>(apiURL, { params })
       .pipe(map(datarecd => {                      
           return ( datarecd);                        
       }));
     
    }

  logout()
  {
    this.Loggeduser = "";    
    //this.selectedCompany = "";
    this.authenticated = false;
    sessionStorage.clear();
    this.router.navigate (['']);
  }


}
