import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GlobalsService } from 'src/app/globals.service';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { ClsVoucher, TypeVoucher } from 'src/app/Dashboard/Classes/ClsVouchers';
import { PaymentComponent } from './payment/payment.component';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})

@AutoUnsubscribe
export class PaymentsComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private dialog: MatDialog ){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  PaymentList!: TypeVoucher[];
  dataSource!: MatTableDataSource<TypeVoucher>;  
  columnsToDisplay: string[] = [ '#', 'Vou_No', 'VouDate', 'Cash_Amount', "Bank_Amount" ,'crud'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadPaymentList();
  }

  LoadPaymentList(){
    let grp = new ClsVoucher(this.dataService);    
    grp.getVouchers(0,this.globals.VTypPayment, 0).subscribe( data => {    
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.PaymentList = JSON.parse(data.apiData);
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    }); 
  } 

  AddNewPayment(){
    var grp = new ClsVoucher(this.dataService);    
    this.OpenPayment(grp.Initialize());    
  }

  OpenPayment(grp: TypeVoucher){            
    const dialogRef = this.dialog.open(PaymentComponent, 
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
            this.LoadPaymentList();
          }          
        }        
      });  
  } 

  DeletePayment(Payment: TypeVoucher){
    this.globals.QuestionAlert("Are you sure you wanto to delete this Payment?").subscribe(Response => {      
      if (Response == 1){
        let grp = new ClsVoucher(this.dataService);
        grp.Voucher = Payment;
        grp.deleteVoucher().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info","Payment deleted successfully",1500);
            const index =  this.PaymentList.indexOf(Payment);
            this.PaymentList.splice(index,1);
            this.LoadDataIntoMatTable();
          }
        })        
      }
    })
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeVoucher> (this.PaymentList);       
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
