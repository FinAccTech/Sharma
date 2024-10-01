import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GlobalsService } from 'src/app/globals.service';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { ClsVoucher, TypeVoucher } from 'src/app/Dashboard/Classes/ClsVouchers';
import { ReceiptComponent } from './receipt/receipt.component';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
@AutoUnsubscribe
export class ReceiptsComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private dialog: MatDialog ){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  ReceiptList!: TypeVoucher[];
  dataSource!: MatTableDataSource<TypeVoucher>;  
  columnsToDisplay: string[] = [ '#', 'Vou_No', 'VouDate', 'Cash_Amount', "Bank_Amount" ,'crud'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadReceiptList();
  }

  LoadReceiptList(){
    let grp = new ClsVoucher(this.dataService);    
    grp.getVouchers(0,this.globals.VTypReceipt, 0).subscribe( data => {    
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.ReceiptList = JSON.parse(data.apiData);
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    }); 
  } 

  AddNewReceipt(){
    var grp = new ClsVoucher(this.dataService);    
    this.OpenReceipt(grp.Initialize());    
  }

  OpenReceipt(grp: TypeVoucher){            
    const dialogRef = this.dialog.open(ReceiptComponent, 
      {
        width:"45vw",
        height:"100vh",
        position:{"right":"0","top":"0" },
        data: grp,
      });      

      dialogRef.disableClose = true; 
      dialogRef.afterClosed().subscribe(result => {        
        
        if (result) 
        { 
          if (result == true)
          {
            this.LoadReceiptList();
          }          
        }        
      });  
  } 

  DeleteReceipt(Receipt: TypeVoucher){
    this.globals.QuestionAlert("Are you sure you wanto to delete this Receipt?").subscribe(Response => {      
      if (Response == 1){
        let grp = new ClsVoucher(this.dataService);
        grp.Voucher = Receipt;
        grp.deleteVoucher().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info","Receipt deleted successfully",1500);
            const index =  this.ReceiptList.indexOf(Receipt);
            this.ReceiptList.splice(index,1);
            this.LoadDataIntoMatTable();
          }
        })        
      }
    })
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeVoucher> (this.ReceiptList);       
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
  
}
