import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/Auth/auth.service';
import { TypeCompanies } from 'src/app/GlobalTypes/TypeCompany';


@Injectable({
  providedIn: 'root'
})
export class CompanybroadcastService {

  constructor(private auth: AuthService) { }

  private subjectName = new Subject<any>(); //need to create a subject
    
  sendUpdate( comp: TypeCompanies ) { //the component that wants to update something, calls this fn    
      this.subjectName.next({CurrentComp: comp }); //next() will feed the value in Subject            
      this.auth.CompSelected = true;
      sessionStorage.setItem("compselected","1");
      sessionStorage.setItem("selectedcompsno",comp.CompSno.toString());
      sessionStorage.setItem("selectedcompname",comp.Comp_Name);

      this.auth.SelectedCompSno = +sessionStorage.getItem("selectedcompsno")!;
      this.auth.SelectedCompName = sessionStorage.getItem("selectedcompname")!;
      
  }

  getUpdate(): Observable<any> { //the receiver component calls this function 
      return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  
}



