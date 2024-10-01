import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ClsLGrp, TypeLGrp } from 'src/app/Dashboard/Classes/ClsLedger_Groups';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { GlobalsService } from 'src/app/globals.service';

@Component({
  selector: 'app-ledgergroup',
  templateUrl: './ledgergroup.component.html',
  styleUrls: ['./ledgergroup.component.scss']
})

@AutoUnsubscribe
export class LedgergroupComponent implements OnInit {

  LGrp!: TypeLGrp;  
  DataChanged: boolean = false;


  // For Validations  
  LGrpNameValid: boolean = true;
  
  constructor(
    public dialogRef: MatDialogRef<LedgergroupComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeLGrp,    
    private dataService: DataService,    
    private globals: GlobalsService
  ) 
  {    
    this.LGrp = data;        
  }

  ngOnInit(): void {    
        
  }

  SaveLGrp(){    
    if (this.ValidateInputs() == false) {return};    
    let um = new ClsLGrp(this.dataService);
    um.LGrp = this.LGrp;    
    um.saveLGrp().subscribe(data => {
        if (data.queryStatus == 0) {
          this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
          return;
        }
        else{          
          this.globals.SnackBar("info", this.LGrp.GrpSno == 0 ? "LGrp created successfully" : "LGrp updated successfully",1200);
          this.DataChanged = true;
          this.CloseDialog();
        }
    }, 
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);
    }
    )
  }

  DeleteLGrp(){
    if (this.LGrp.GrpSno == 0){
      this.globals.SnackBar("error", "No LGrp selected to delete",1200);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this LGrp?").subscribe(Response => {      
      if (Response == 1){
        let um = new ClsLGrp(this.dataService);
        um.LGrp = this.LGrp;
        um.deleteLGrp().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "LGrp deleted successfully",1500);
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

    return true;
  }
  // SetActiveStatus($event: any){    
  //   console.log (this.LGrp.Active_Status);
  //   console.log ($event.target.checked);
  // }
}

