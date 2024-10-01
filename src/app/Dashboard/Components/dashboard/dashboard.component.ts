import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Auth/auth.service';
import { CompanybroadcastService } from '../../Services/companybroadcast.service';
import { MenuTree } from './MenuTree';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

@AutoUnsubscribe
export class DashboardComponent { 
  LoggedUser: string = "";
  Comp_Name: string = "";
  Comp_Logo: string = "";
  
  TreeData = MenuTree;
  Expanded: boolean[] = [];

  subscriptionName: Subscription;
  
  constructor(private router: Router, private auth: AuthService, private CompService: CompanybroadcastService){
    this.subscriptionName = this.CompService.getUpdate().subscribe
                        (data => { //message contains the data sent from service                          
                            this.Comp_Name = data.CurrentComp.Comp_Name;
                            this.Comp_Logo = data.CurrentComp.Comp_Logo;
                        });
  }

  ngOnInit(){
    //this.Client_Name =  sessionStorage.getItem("sessionClientName")!;      
    this.LoggedUser = this.auth.Loggeduser;
    for (var i=0; i<=this.TreeData.length; i++)
      {
        this.Expanded[i] = false;
      } 
  }
 
  ToggleSubMenu(index: number){
    // for (var i=0; i<=this.TreeData.length; i++)
    //   {
    //     this.Expanded[i] = false;
    //   } 
    this.Expanded[index] = !this.Expanded[index];    
  }

  SignOut(){       
    sessionStorage.clear();
    this.router.navigate (['']);
  }
  Homepage(){    
    this.router.navigate(['dashboard/indexpage']);
  }

  ListCompanies()
  {
    this.router.navigate(['dashboard/companies']);
  }
  ngOnDestroy(){
    this.subscriptionName.unsubscribe();
  }
}
