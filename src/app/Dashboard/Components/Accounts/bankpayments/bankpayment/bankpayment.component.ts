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
  selector: 'app-bankpayment',
  templateUrl: './bankpayment.component.html',
  styleUrls: ['./bankpayment.component.scss']
})

@AutoUnsubscribe
export class BankpaymentComponent implements OnInit {

  BankPayment!: TypeVoucher;  
  DataChanged: boolean = false;
  SeriesList!:      TypeVoucherSeries[];
  LedList:      TypeLedger[] = [];
  BanksList: TypeLedger[] = [];
  AutoVouNo: boolean = false;

  
  // For Validations  
  BankPaymentNoValid: boolean = true;
  
  constructor(
    public dialogRef: MatDialogRef<BankpaymentComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeVoucher,    
    private dataService: DataService,    
    private globals: GlobalsService
  ) 
  {    
    this.BankPayment = data;    
    
  }

  ngOnInit(): void {    
    console.log (this.data);
    let ser = new ClsVoucherSeries(this.dataService);
    ser.getSeriess(0,this.globals.VTypBankPayment).subscribe(data => {         
      this.SeriesList = JSON.parse (data.apiData);         
      if  (this.BankPayment.VouSno == 0 )
        {
          this.BankPayment.Series = this.SeriesList[0];          
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
    ser.getSeriess(this.globals.VTypBankPayment,0).subscribe(data=> {

      let trans = new ClsTransactions(this.dataService);
      switch (JSON.parse(data.apiData)[0].Num_Method) {
        case 0:
          this.BankPayment.Vou_No = '';
          break;

        case 1:                    
          trans.getVoucherNumber(this.globals.VTypBankPayment).subscribe(data =>{
            this.BankPayment.Vou_No = data.apiData;
          });
          break;      

        case 2:                  
          trans.getVoucherNumber(this.globals.VTypBankPayment).subscribe(data =>{
            this.BankPayment.Vou_No = data.apiData;
          });
          this.AutoVouNo = true;
          break;
      }      
    });    
  }

  SaveBankPayment(){    
    if (this.ValidateInputs() == false) {return};    
    let led = new ClsLedger(this.dataService);
    var CashLedSno = 0;
    led.getCashAccount().subscribe(data => {
    CashLedSno = JSON.parse (data.apiData)[0].LedSno;     
      
      let um = new ClsVoucher(this.dataService);
      this.BankPayment.VouTypeSno = this.globals.VTypBankPayment;
      this.BankPayment.Ledger = this.BankPayment.Bank;
      
      um.Voucher = this.BankPayment;    
      
      um.Voucher.VouDetailXML = this.globals.GenerateVoucherXML(um.Voucher,CashLedSno);
      

      um.saveVoucher().subscribe(data => {
          if (data.queryStatus == 0) {
            this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
            return;
          }
          else{          
            this.globals.SnackBar("info", this.BankPayment.VouSno == 0 ? "BankPayment created successfully" : "BankPayment updated successfully",1200);
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

  DeleteBankPayment(){
    if (this.BankPayment.VouSno == 0){
      this.globals.SnackBar("error", "No BankPayment selected to delete",1200);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this BankPayment?").subscribe(Response => {      
      if (Response == 1){
        let um = new ClsVoucher(this.dataService);
        um.Voucher = this.BankPayment;
        um.deleteVoucher().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "BankPayment deleted successfully",1500);
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
    if (!this.BankPayment.Vou_No!.length )  { this.BankPaymentNoValid = false;  return false; }  else  {this.BankPaymentNoValid = true; }    
    return true;
  }

  getSeries($event: TypeVoucherSeries){
    this.BankPayment.Series = $event;    
    this.GetVoucherNumber();    
  }

  getLedger($event: TypeLedger){
    this.BankPayment.Ledger = $event;        
  }

  getBank($event: TypeLedger){
    this.BankPayment.Bank = $event;
  }

  // SetActiveStatus($event: any){    
  //   console.log (this.BankPayment.Active_Status);
  //   console.log ($event.target.checked);
  // }
}

