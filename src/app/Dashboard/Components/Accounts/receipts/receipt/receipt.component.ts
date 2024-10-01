import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ClsLedger, TypeLedger } from 'src/app/Dashboard/Classes/ClsLedgers';
import { ClsTransactions } from 'src/app/Dashboard/Classes/ClsTransactions';
import { ClsVoucherSeries, TypeVoucherSeries } from 'src/app/Dashboard/Classes/ClsVoucherSeries';
import { ClsVoucher, TypeVoucher } from 'src/app/Dashboard/Classes/ClsVouchers';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { GlobalsService } from 'src/app/globals.service';


@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})

@AutoUnsubscribe
export class ReceiptComponent implements OnInit {

  Receipt!: TypeVoucher;  
  DataChanged: boolean = false;
  SeriesList!:      TypeVoucherSeries[];
  LedList:      TypeLedger[] = [];
  BanksList: TypeLedger[] = [];
  AutoVouNo: boolean = false;

  
  // For Validations  
  ReceiptNoValid: boolean = true;
  
  constructor(
    public dialogRef: MatDialogRef<ReceiptComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeVoucher,    
    private dataService: DataService,    
    private globals: GlobalsService
  ) 
  {    
    this.Receipt = data;    
    
  }

  ngOnInit(): void {    
    console.log (this.data);
    let ser = new ClsVoucherSeries(this.dataService);
    ser.getSeriess(0,this.globals.VTypReceipt).subscribe(data => {         
      this.SeriesList = JSON.parse (data.apiData);         
      if  (this.Receipt.VouSno == 0 )
        {
          this.Receipt.Series = this.SeriesList[0];          
          this.GetVoucherNumber();
        }      
    });    
    
    let led = new ClsLedger(this.dataService);
    led.getLedgers(0,0).subscribe(data => {         
      this.LedList= JSON.parse (data.apiData);               
    });    

    led.getBankAccounts().subscribe(data => {      
      this.BanksList = JSON.parse (data.apiData);      
    })

  }

  GetVoucherNumber(){
    let ser = new ClsVoucherSeries(this.dataService);
    ser.getSeriess(this.globals.VTypReceipt,0).subscribe(data=> {

      let trans = new ClsTransactions(this.dataService);
      switch (JSON.parse(data.apiData)[0].Num_Method) {
        case 0:
          this.Receipt.Vou_No = '';
          break;

        case 1:                    
          trans.getVoucherNumber(this.globals.VTypReceipt).subscribe(data =>{
            this.Receipt.Vou_No = data.apiData;
          });
          break;      

        case 2:                  
          trans.getVoucherNumber(this.globals.VTypReceipt).subscribe(data =>{
            this.Receipt.Vou_No = data.apiData;
          });
          this.AutoVouNo = true;
          break;
      }      
    });    
  }

  SaveReceipt(){    
    if (this.ValidateInputs() == false) {return};    
    let led = new ClsLedger(this.dataService);
    var CashLedSno = 0;
    led.getCashAccount().subscribe(data => {
      CashLedSno = JSON.parse (data.apiData)[0].LedSno;     
      
      let um = new ClsVoucher(this.dataService);
      this.Receipt.VouTypeSno = this.globals.VTypReceipt;
      um.Voucher = this.Receipt;    
      um.Voucher.VouDetailXML = this.globals.GenerateVoucherXML(um.Voucher,CashLedSno);
      

      um.saveVoucher().subscribe(data => {
          if (data.queryStatus == 0) {
            this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
            return;
          }
          else{          
            this.globals.SnackBar("info", this.Receipt.VouSno == 0 ? "Receipt created successfully" : "Receipt updated successfully",1200);
            this.DataChanged = true;
            this.CloseDialog();
          }
      }, 
      error => {
        this.globals.ShowAlert(this.globals.DialogTypeError, error);
      }
      )

    });

    
  }

  DeleteReceipt(){
    if (this.Receipt.VouSno == 0){
      this.globals.SnackBar("error", "No Receipt selected to delete",1200);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this Receipt?").subscribe(Response => {      
      if (Response == 1){
        let um = new ClsVoucher(this.dataService);
        um.Voucher = this.Receipt;
        um.deleteVoucher().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "Receipt deleted successfully",1500);
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
    return this.globals.DateToInt( new Date ($event.target.value));
  }

  ValidateInputs(): boolean{        
    if (!this.Receipt.Vou_No!.length )  { this.ReceiptNoValid = false;  return false; }  else  {this.ReceiptNoValid = true; }    
    return true;
  }

  getSeries($event: TypeVoucherSeries){
    this.Receipt.Series = $event;    
    this.GetVoucherNumber();    
  }

  getLedger($event: TypeLedger){
    this.Receipt.Ledger = $event;        
  }

  getBank($event: TypeLedger){
    this.Receipt.Bank = $event;
  }

  // SetActiveStatus($event: any){    
  //   console.log (this.Receipt.Active_Status);
  //   console.log ($event.target.checked);
  // }
}

