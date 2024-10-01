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
  selector: 'app-bankreceipt',
  templateUrl: './bankreceipt.component.html',
  styleUrls: ['./bankreceipt.component.scss']
})

@AutoUnsubscribe
export class BankreceiptComponent implements OnInit {

  BankReceipt!: TypeVoucher;  
  DataChanged: boolean = false;
  SeriesList!:      TypeVoucherSeries[];
  LedList:      TypeLedger[] = [];
  BanksList: TypeLedger[] = [];
  AutoVouNo: boolean = false;

  
  // For Validations  
  BankReceiptNoValid: boolean = true;
  
  constructor(
    public dialogRef: MatDialogRef<BankreceiptComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeVoucher,    
    private dataService: DataService,    
    private globals: GlobalsService
  ) 
  {    
    this.BankReceipt = data;    
    
  }

  ngOnInit(): void {    
    console.log (this.data);
    let ser = new ClsVoucherSeries(this.dataService);
    ser.getSeriess(0,this.globals.VTypBankReceipt).subscribe(data => {         
      this.SeriesList = JSON.parse (data.apiData);         
      if  (this.BankReceipt.VouSno == 0 )
        {
          this.BankReceipt.Series = this.SeriesList[0];          
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
    ser.getSeriess(this.globals.VTypBankReceipt,0).subscribe(data=> {

      let trans = new ClsTransactions(this.dataService);
      switch (JSON.parse(data.apiData)[0].Num_Method) {
        case 0:
          this.BankReceipt.Vou_No = '';
          break;

        case 1:                    
          trans.getVoucherNumber(this.globals.VTypBankReceipt).subscribe(data =>{
            this.BankReceipt.Vou_No = data.apiData;
          });
          break;      

        case 2:                  
          trans.getVoucherNumber(this.globals.VTypBankReceipt).subscribe(data =>{
            this.BankReceipt.Vou_No = data.apiData;
          });
          this.AutoVouNo = true;
          break;
      }      
    });    
  }

  SaveBankReceipt(){    
    if (this.ValidateInputs() == false) {return};    
    let led = new ClsLedger(this.dataService);
    var CashLedSno = 0;
    led.getCashAccount().subscribe(data => {
      CashLedSno = JSON.parse (data.apiData)[0].LedSno;     
      
      let um = new ClsVoucher(this.dataService);
      this.BankReceipt.VouTypeSno = this.globals.VTypBankReceipt;
      um.Voucher = this.BankReceipt;    
      this.BankReceipt.Ledger = this.BankReceipt.Bank;
      um.Voucher.VouDetailXML = this.globals.GenerateVoucherXML(um.Voucher,CashLedSno);
      

      um.saveVoucher().subscribe(data => {
          if (data.queryStatus == 0) {
            this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
            return;
          }
          else{          
            this.globals.SnackBar("info", this.BankReceipt.VouSno == 0 ? "BankReceipt created successfully" : "BankReceipt updated successfully",1200);
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

  DeleteBankReceipt(){
    if (this.BankReceipt.VouSno == 0){
      this.globals.SnackBar("error", "No BankReceipt selected to delete",1200);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this BankReceipt?").subscribe(Response => {      
      if (Response == 1){
        let um = new ClsVoucher(this.dataService);
        um.Voucher = this.BankReceipt;
        um.deleteVoucher().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "BankReceipt deleted successfully",1500);
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
    if (!this.BankReceipt.Vou_No!.length )  { this.BankReceiptNoValid = false;  return false; }  else  {this.BankReceiptNoValid = true; }    
    return true;
  }

  getSeries($event: TypeVoucherSeries){
    this.BankReceipt.Series = $event;    
    this.GetVoucherNumber();    
  }

  getLedger($event: TypeLedger){
    this.BankReceipt.Ledger = $event;        
  }

  getBank($event: TypeLedger){
    this.BankReceipt.Bank = $event;
  }

  // SetActiveStatus($event: any){    
  //   console.log (this.BankReceipt.Active_Status);
  //   console.log ($event.target.checked);
  // }
}

