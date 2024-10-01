import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ClsItem } from 'src/app/Dashboard/Classes/ClsItems';
import { TypeItem } from 'src/app/Dashboard/Classes/ClsItems';
import { ClsUom, TypeUom } from 'src/app/Dashboard/Classes/ClsUoms';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { GlobalsService } from 'src/app/globals.service';

@AutoUnsubscribe
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})

export class ItemComponent implements OnInit {
  
  Item!:          TypeItem;
  UomList!: TypeUom[];
  //SelectedUom!: TypeUom;
  
  
  DataChanged:    boolean = false;

  // For Validations  
  ItemNameValid: boolean = true;
  GrpNameValid: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ItemComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeItem,    
    private dataService: DataService,        
    private globals: GlobalsService
  ) 
  {
    this.Item = data;          
  }

  ngOnInit(): void {    
    let uom = new ClsUom(this.dataService);
      uom.getUoms(0).subscribe(data=> {
        if (data.queryStatus == 0){
          this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
          return;
        }
        else{
          this.UomList = JSON.parse (data.apiData);
          // this.SelectedUom[0] = this.UomList[0];
        }
      },
      error => {
        this.globals.ShowAlert(this.globals.DialogTypeError,error);
        return;             
      });

  }

  SaveItem(){        

    if (this.ValidateInputs() == false) {return};    

    let itm = new ClsItem(this.dataService);
    itm.Item = this.Item;    
    itm.saveItem().subscribe(data => {
        if (data.queryStatus == 0) {
          this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
          return;
        }
        else{          
          this.globals.SnackBar("info", this.Item.ItemSno == 0 ? "Item Created successfully" : "Item updated successfully",2000);
          this.DataChanged = true;
          itm.Item.ItemSno = data.RetSno;
          itm.Item.Name = itm.Item.Item_Name;
          itm.Item.Details = "Code: " + itm.Item.Item_Code;
          this.CloseDialog(itm.Item);
          
        }
    }, 
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);
    }
    )
  }

  DeleteItem(){
    if (this.Item.ItemSno == 0){
      this.globals.SnackBar("error", "No Item selected to delete",1200);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this Item?").subscribe(Response => {      
      if (Response == 1){
        let itm = new ClsItem(this.dataService);
        itm.Item = this.Item;
        itm.deleteItem().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "Item deleted successfully",1500);
            this.DataChanged = true;
            this.CloseDialog(itm.Item);
          }
        })        
      }
    })
  }

  CloseDialog(itm: TypeItem)  {
    this.dialogRef.close(itm); 
  }

  DateToInt($event: any): number{    
    return this.globals.DateToInt( new Date ($event));
  }

  ValidateInputs(): boolean{            
    if (!this.Item.Item_Name.length )  { this.ItemNameValid = false;  return false; }  else  {this.ItemNameValid = true; }    
    
    return true;
  }

  getUom($event: TypeUom){          
    this.Item.Uom = $event;
    //this.SelectedUom = $event;      
  }

  
  // SetActiveStatus($event: any){    
  //   console.log (this.ItemGroup.Active_Status);
  //   console.log ($event.target.checked);
  // }
  

}
