import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TypeTransactions } from '../../Classes/ClsTransactions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TypeGridItem } from '../../Types/TypeGridItem';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-stockselection',
  templateUrl: './stockselection.component.html',
  styleUrls: ['./stockselection.component.scss']
})
export class StockselectionComponent implements AfterViewInit {
constructor(  public dialogRef: MatDialogRef<StockselectionComponent>,
  private dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,){

  }

  
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  StockRegisterList!: TypeTransactions[];
  dataSource!: MatTableDataSource<TypeTransactions>;  
  columnsToDisplay: string[] = [ '#', 'Selected', 'Batch_No', 'Trans_No', 'Trans_Date', 'VouType_Name', 'Item_Name', 'Description', 'Uom_Name', 'Karat','GrossWt','StoneWt','NettWt','PurityPer','Rate','Amount','BalGrossWt','BalNettWt'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  SelectedItems: TypeGridItem[] = [];     

  selection: any;

  ngOnInit(){    
    this.StockRegisterList = this.data;
    this.LoadDataIntoMatTable();
  } 

  ngAfterViewInit(){ 
     
  }

  // LoadStockRegisterList(){
  //   let itm = new ClsTransactions(this.dataService);    
  //   itm.getBatchStock().subscribe( data => {          
  //     if (data.queryStatus == 0){
  //       this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
  //     }
  //     else{              
  //       this.StockRegisterList = JSON.parse(data.apiData);                
  //       this.LoadDataIntoMatTable();
  //     }
  //   },
  //   error => {
  //     this.globals.ShowAlert(this.globals.DialogTypeError, error);      
  //   });
  // }


  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeTransactions> (this.StockRegisterList);        
    if (this.dataSource.filteredData)
    { 
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);      
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // SelectItem(item: any){
  //   let emitItem: TypeGridItem;     
    
  //   emitItem = {"Item":{"ItemSno":item.ItemSno, "Item_Name": item.Item_Name, "Item_Code": item.Item_Code, "Name": item.Item_Name, "Details": "Code: " + item.Item_Name}, 
  //               "Uom" : {"UomSno": item.UomSno, "Uom_Code":item.Uom_Code, "Uom_Name": item.Uom_Name, "Name" :item.Uom_Name, "Details": "Code: " + item.Uom_Code},
  //               "BatchSno" :item.BatchSno, "Batch_No" : item.Batch_No, "Qty":1,
  //               "Karat" : item.Karat, "PurityPer" :item.PurityPer, "GrossWt":+item.GrossWt, "StoneWt":+item.StoneWt, "NettWt":+item.NettWt, "Rate" :item.Rate, "Amount" :item.Amount, "Remarks" :item.Remarks, "BatchItems" :""
  //             }             
              
  //   this.dialogRef.close(emitItem); 
  // }

  AddtoSelection($event: any,i: number, item: any){
    
    if ($event.target.checked === true){
      //this.StockRegisterList[i].Selected = 1;
      item.Selected = 1;
    }
      else{
        item.Selected = 0;
        //this.StockRegisterList[i].Selected = 0;
      }
      
    //   let emitItem: TypeGridItem;         
    //   emitItem = {
    //               "Item":{"ItemSno":item.ItemSno, "Item_Name": item.Item_Name, "Item_Code": item.Item_Code, "Name": item.Item_Name, "Details": "Code: " + item.Item_Name}, 
    //               "Uom" : {"UomSno": item.UomSno, "Uom_Code":item.Uom_Code, "Uom_Name": item.Uom_Name, "Name" :item.Uom_Name, "Details": "Code: " + item.Uom_Code},
    //               "BatchSno" :item.BatchSno, "Batch_No" : item.Batch_No, "Qty":1,
    //               "Karat" : item.Karat, "PurityPer" :item.PurityPer, "GrossWt":+item.GrossWt, "StoneWt":+item.StoneWt, "NettWt":+item.NettWt, "Rate" :item.Rate, "Amount" :item.Amount, "Remarks" :item.Description, "BatchItems" :""
    //             }             
    //   this.SelectedItems.push (emitItem);
    // }     
  }

  EmitSelections(){
    // this.dialogRef.close(this.SelectedItems); 
    this.dialogRef.close(this.StockRegisterList);  
  }

  getPageData() {
    // return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
    //console.log (this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData)) );

  }

  // isEntirePageSelected() {
  //   return this.getPageData().every((row) => this.selection.isSelected(row));
  // }

  // masterToggle(checkboxChange: MatCheckboxChange) {
  //   this.isEntirePageSelected() ?
  //     this.selection.deselect(...this.getPageData()) :
  //     this.selection.select(...this.getPageData());
  // }

  // checkboxLabel(row): string {
  //   if (!row) {
  //     return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  // }
}
