import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ClsUom } from 'src/app/Dashboard/Classes/ClsUoms';
import { TypeUom } from 'src/app/Dashboard/Classes/ClsUoms';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { GlobalsService } from 'src/app/globals.service';

interface RestrictType{ 
  value : number;
  text: string;
} 

@AutoUnsubscribe

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss']
}) 

export class UomComponent implements OnInit {

  RestrictTypesList: RestrictType[] = [
    {value: 0, text: "Allow"},
    {value: 1, text: "Restrict"},
    {value: 2, text: "Show Alert"},    
  ];
  
  Uom!: TypeUom;
  BaseUomsList!:      TypeUom[];
  SelectedBaseUom!:     TypeUom;
  DataChanged: boolean = false;


  // For Validations  
  UomNameValid: boolean = true;
  
  constructor(
    public dialogRef: MatDialogRef<UomComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeUom,    
    private dataService: DataService,    
    private globals: GlobalsService
  ) 
  {    
    this.Uom = data;    
    this.SelectedBaseUom = this.Uom.BaseUom!;    
  }

  ngOnInit(): void {    
    let ar = new ClsUom(this.dataService);
    ar.getUoms(0).subscribe(data => {      
      this.BaseUomsList = JSON.parse (data.apiData);   
      if (this.Uom.UomSno == 0){
        this.SelectedBaseUom = this.BaseUomsList[0];
        this.Uom.BaseUom = this.SelectedBaseUom;    
      }            
      
    });    

    
  }

  SaveUom(){    
    if (this.ValidateInputs() == false) {return};    
    let um = new ClsUom(this.dataService);
    um.Uom = this.Uom;    
    um.saveUom().subscribe(data => {
        if (data.queryStatus == 0) {
          this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
          return;
        }
        else{          
          um.Uom.UomSno = data.RetSno;          
          um.Uom.Name = um.Uom.Uom_Name;
          um.Uom.Details = "Code: " + um.Uom.Uom_Code;
          this.globals.SnackBar("info", this.Uom.UomSno == 0 ? "Uom created successfully" : "Uom updated successfully",1200);
          this.DataChanged = true;                    
          this.CloseDialog(um.Uom);

        }
    }, 
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);
    }
    )
  }

  DeleteUom(){
    if (this.Uom.UomSno == 0){
      this.globals.SnackBar("error", "No Uom selected to delete",1200);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this Uom?").subscribe(Response => {      
      if (Response == 1){
        let um = new ClsUom(this.dataService);
        um.Uom = this.Uom;
        um.deleteUom().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "Uom deleted successfully",1500);
            this.DataChanged = true;
            this.CloseDialog(um.Uom);
          }
        })        
      }
    })
  }

  getBaseUom($event: TypeUom){
    this.SelectedBaseUom = $event;
    this.Uom.BaseUom = this.SelectedBaseUom;        
  }

  CloseDialog(um: TypeUom)  {
    this.dialogRef.close(um); 
  }

  DateToInt($event: any): number{    
    return this.globals.DateToInt( new Date ($event));
  }

  ValidateInputs(): boolean{        
    if (!this.Uom.Uom_Name!.length )  { this.UomNameValid = false;  return false; }  else  {this.UomNameValid = true; }    
    return true;
  }
  // SetActiveStatus($event: any){    
  //   console.log (this.Uom.Active_Status);
  //   console.log ($event.target.checked);
  // }
}

