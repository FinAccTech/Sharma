import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GlobalsService } from 'src/app/globals.service';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { ClsVoucher, TypeVoucher } from 'src/app/Dashboard/Classes/ClsVouchers';
import { BankpaymentComponent } from './bankpayment/bankpayment.component';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';


@Component({
  selector: 'app-bankpayments',
  templateUrl: './bankpayments.component.html',
  styleUrls: ['./bankpayments.component.scss']
})

@AutoUnsubscribe
export class BankpaymentsComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private dialog: MatDialog ){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  BankPaymentList!: TypeVoucher[];
  dataSource!: MatTableDataSource<TypeVoucher>;  
  columnsToDisplay: string[] = [ '#', 'Vou_No', 'VouDate', 'Cash_Amount', "Bank_Amount" ,'crud'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadBankPaymentList();
  }

  LoadBankPaymentList(){
    let grp = new ClsVoucher(this.dataService);    
    grp.getVouchers(0,this.globals.VTypBankPayment, 0).subscribe( data => {    
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.BankPaymentList = JSON.parse(data.apiData);
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    }); 
  } 

  AddNewBankPayment(){
    var grp = new ClsVoucher(this.dataService);    
    this.OpenBankPayment(grp.Initialize());    
  }

  OpenBankPayment(grp: TypeVoucher){            
    const dialogRef = this.dialog.open(BankpaymentComponent, 
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
            this.LoadBankPaymentList();
          }          
        }        
      });  
  } 

  DeleteBankPayment(BankPayment: TypeVoucher){
    this.globals.QuestionAlert("Are you sure you wanto to delete this BankPayment?").subscribe(Response => {      
      if (Response == 1){
        let grp = new ClsVoucher(this.dataService);
        grp.Voucher = BankPayment;
        grp.deleteVoucher().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info","BankPayment deleted successfully",1500);
            const index =  this.BankPaymentList.indexOf(BankPayment);
            this.BankPaymentList.splice(index,1);
            this.LoadDataIntoMatTable();
          }
        })        
      }
    })
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeVoucher> (this.BankPaymentList);       
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
