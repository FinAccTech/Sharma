import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ClsLGrp, TypeLGrp } from 'src/app/Dashboard/Classes/ClsLedger_Groups';
import { ClsLedger } from 'src/app/Dashboard/Classes/ClsLedgers';
import { TypeLedger } from 'src/app/Dashboard/Classes/ClsLedgers';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { GlobalsService } from 'src/app/globals.service';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})

@AutoUnsubscribe
export class LedgerComponent implements OnInit {

  Ledger!: TypeLedger;  
  DataChanged: boolean = false;
  LGrpList: TypeLGrp[] = [];
  SelectedLGrp!: TypeLGrp;


  // For Validations  
  LedgerNameValid: boolean = true;
  
  constructor(
    public dialogRef: MatDialogRef<LedgerComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeLedger,    
    private dataService: DataService,    
    private globals: GlobalsService
  ) 
  {    
    this.Ledger = data;        
  }

  ngOnInit(): void {    
      let grp = new ClsLGrp(this.dataService);
      grp.getLGrps(0).subscribe(data => {
        this.LGrpList = JSON.parse (data.apiData);
      })
  }

  SaveLedger(){    
    if (this.ValidateInputs() == false) {return};    
    let um = new ClsLedger(this.dataService);
    um.Ledger = this.Ledger;    
    um.saveLedger().subscribe(data => {
        if (data.queryStatus == 0) {
          this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
          return;
        }
        else{          
          this.globals.SnackBar("info", this.Ledger.Grp && this.Ledger.Grp.GrpSno == 0 ? "Ledger created successfully" : "Ledger updated successfully",1200);
          this.DataChanged = true;
          this.CloseDialog();
        }
    }, 
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);
    }
    )
  }

  DeleteLedger(){
    if ( this.Ledger.Grp && this.Ledger.Grp.GrpSno == 0){
      this.globals.SnackBar("error", "No Ledger selected to delete",1200);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this Ledger?").subscribe(Response => {      
      if (Response == 1){
        let um = new ClsLedger(this.dataService);
        um.Ledger = this.Ledger;
        um.deleteLedger().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "Ledger deleted successfully",1500);
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

  getLGrp($event: TypeLGrp){
    this.SelectedLGrp = $event;  
    this.Ledger.Grp = this.SelectedLGrp;  
  }
}

