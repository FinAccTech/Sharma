import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AuthService } from 'src/app/Auth/auth.service';
import { ClsUser } from 'src/app/Dashboard/Classes/ClsUsers';
import { TypeUser } from 'src/app/Dashboard/Classes/ClsUsers';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { TypeCompanies } from 'src/app/GlobalTypes/TypeCompany';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { GlobalsService } from 'src/app/globals.service';

interface CompRights{ 
  CompSno : number;
  Checked: boolean;
} 

@AutoUnsubscribe
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  
  CompRights: CompRights[] = [
    {CompSno: 1, Checked: false},
    {CompSno: 2, Checked: false},    
  ];
  
  User!: TypeUser;
  DataChanged: boolean = false;
  companiesList: TypeCompanies[] = [];

  // For Validations  
  UserNameValid: boolean = true;
  PasswordValid: boolean = true;
  
  constructor(
    public dialogRef: MatDialogRef<UserComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeUser,    
    private dataService: DataService,    
    private globals: GlobalsService,
    private auth: AuthService
  ) 
  {    
    console.log (data);
    this.User = data;        
    this.CompRights[0].Checked = data.Comp1Right ==1 ? true : false;
    this.CompRights[1].Checked = data.Comp2Right ==1 ? true : false;
  }

  ngOnInit(): void {    
    this.auth.GetCompaniesList(this.auth.LoggedUserSno).subscribe(data =>{      
      this.companiesList = JSON.parse (data.apiData);
    });
  }

  SaveUser(){    
    if (this.ValidateInputs() == false) {return};    
    let um = new ClsUser(this.dataService);
    um.User = this.User;    
    this.User.Comp1Right = this.CompRights[0].Checked == true  ? 1 : 0;
    this.User.Comp2Right = this.CompRights[1].Checked == true  ? 1 : 0;
    um.saveUser().subscribe(data => {
        if (data.queryStatus == 0) {
          this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
          return;
        }
        else{          
          this.globals.SnackBar("info", this.User.UserSno == 0 ? "User created successfully" : "User updated successfully",1200);
          this.DataChanged = true;
          this.CloseDialog();
        }
    }, 
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);
    }
    )
  }

    
  UpdateRights($event: any,i: number,){    
      this.CompRights[i].Checked = $event.target.checked    
  }

  DeleteUser(){
    if (this.User.UserSno == 0){
      this.globals.SnackBar("error", "No User selected to delete",1200);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this User?").subscribe(Response => {      
      if (Response == 1){
        let um = new ClsUser(this.dataService);
        um.User = this.User;
        um.deleteUser().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "User deleted successfully",1500);
            this.DataChanged = true;
            this.CloseDialog();
          }
        })        
      }
    })
  }

  
  CloseDialog()  {
    this.dialogRef.close(this.DataChanged);
  }

  DateToInt($event: any): number{    
    return this.globals.DateToInt( new Date ($event));
  }

  ValidateInputs(): boolean{        
    if (!this.User.UserName!.length )  { this.UserNameValid = false;  return false; }  else  {this.UserNameValid = true; }    
    return true;
  }
  // SetActiveStatus($event: any){    
  //   console.log (this.User.Active_Status);
  //   console.log ($event.target.checked);
  // }
}

