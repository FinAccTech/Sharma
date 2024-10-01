import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ClsParties, TypeParties } from 'src/app/Dashboard/Classes/ClsParties';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { ProgressbroadcastService } from 'src/app/Dashboard/Services/progressbroadcast.service';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { GlobalsService } from 'src/app/globals.service';

@AutoUnsubscribe
@Component({
  selector: 'app-jobworker',
  templateUrl: './jobworker.component.html',
  styleUrls: ['./jobworker.component.scss']
})

export class JobworkerComponent implements OnInit {
    
  Party!:         TypeParties;  
  PartyCaption:   string = "";
  DataChanged:    boolean = false;
    
  

  // For Validations  
  PartyNameValid: boolean = true;
  MobNumberValid: boolean = true;
  
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<JobworkerComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeParties,    
    private dataService: DataService,    
    private globals: GlobalsService,
    private progressService: ProgressbroadcastService
    
  ) 
  {
    this.Party = data;      
    
    // this.dialogRef.updateSize("30vw");        
  }

  ngOnInit(): void {            
 
   }

  SaveParty(){        
    if (this.ValidateInputs() == false) {return};    
    
    var StrImageXml: string = "";

    
    StrImageXml = "<ROOT>"
    StrImageXml += "<Images>"
    
    StrImageXml += "</Images>" 
    StrImageXml += "</ROOT>"

    let pty = new ClsParties(this.dataService);
    pty.Party = this.Party;    
    pty.Party.Party_Cat = this.globals.PartyTypJobWorkers;
    pty.Party.ImageDetailXML = StrImageXml;

    this.progressService.sendUpdate("start","Saving Party");
    pty.saveParty().subscribe(data => {      
      this.progressService.sendUpdate("stop","");

        if (data.queryStatus == 0) {
          this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
          return;
        }
        else{          
          this.globals.SnackBar("info", this.Party.PartySno == 0 ? "Party Created successfully" : "Party updated successfully",1200);
          this.DataChanged = true;
          this.CloseDialog();
        }
    },  
    error => {
      this.progressService.sendUpdate("stop","");
      this.globals.ShowAlert(this.globals.DialogTypeError, error);
    }
    )
  }

  DeleteParty(){
    if (this.Party.PartySno == 0){
      this.globals.SnackBar("error", "No Party selected to delete",1500);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this Party?").subscribe(Response => {      
      if (Response == 1){
        let ar = new ClsParties(this.dataService);
        ar.Party = this.Party;
        ar.deleteParty().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "Party deleted successfully",1500);
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
    if (!this.Party.Party_Name!.length )  { this.PartyNameValid = false;  return false; }  else  {this.PartyNameValid = true; }        
    if (this.Party.Mobile!.length < 10)  { this.MobNumberValid = false;  return false; }  else  {this.MobNumberValid = true; }        
    return true;
  }

}
