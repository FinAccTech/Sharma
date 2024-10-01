import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { TypeCompanies } from 'src/app/GlobalTypes/TypeCompany';
import { CompanybroadcastService } from '../../Services/companybroadcast.service';
import { GlobalsService } from 'src/app/globals.service';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { ProgressbroadcastService } from '../../Services/progressbroadcast.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})

@AutoUnsubscribe
export class CompaniesComponent {

  CompList: TypeCompanies[] = [];

  constructor(private auth:AuthService, private router: Router, private CompService: CompanybroadcastService, private globals: GlobalsService, private progressService: ProgressbroadcastService) {

    
  }

  ngOnInit(){    

    if (+sessionStorage.getItem("compselected")! === 1) {      
      this.auth.CompSelected = true;
      this.auth.SelectedCompSno = +sessionStorage.getItem("selectedcompsno")!;
      this.auth.SelectedCompName = sessionStorage.getItem("selectedcompname")!;      
      // this.router.navigate(['dashboard/indexpage']);  
    }
 
    this.progressService.sendUpdate("start","Loading Companies...");
      this.auth.ListCompanies(this.auth.LoggedUserSno).subscribe(data => {            
        this.progressService.sendUpdate("stop","");
        this.CompList = data;      
      }, 
      error => {        
        this.progressService.sendUpdate("stop","");
        this.globals.ShowAlert(this.globals.DialogTypeError, "Network Connection error!! Try Refreshing the Browser. ");
      });
  }

  SelectCompany(comp: TypeCompanies){        
    this.auth.SelectedCompSno = comp.CompSno;
    this.auth.SelectedCompName = comp.Comp_Name;
    this.auth.CompSelected = true;
    this.CompService.sendUpdate(comp);
    this.router.navigate(['dashboard/indexpage']);
    this.globals.SnackBar("info","Company changed to " + comp.Comp_Name ,2000 );
  }

}
