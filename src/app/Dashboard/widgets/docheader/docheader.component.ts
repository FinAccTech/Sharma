import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ClsVoucherSeries, TypeVoucherSeries } from '../../Classes/ClsVoucherSeries';
import { TypeDocHeader } from '../../Types/TypeDocHeader';
import { DataService } from '../../Services/dataservice';
import { GlobalsService } from 'src/app/globals.service';
import { ClsTransactions, TypeTransactions } from '../../Classes/ClsTransactions';
import { ClsLedger, TypeLedger } from '../../Classes/ClsLedgers';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@Component({
  selector: 'app-docheader', 
  templateUrl: './docheader.component.html',
  styleUrls: ['./docheader.component.scss'],  
})

@AutoUnsubscribe
export class DocheaderComponent {
  
  constructor(private dataService: DataService, private globals: GlobalsService){ }

  SeriesList!:      TypeVoucherSeries[];
  RefList: TypeTransactions[] = [];
  BanksList: TypeLedger[] = [];
  AutoVouNo: boolean = false;

  @Input() SelectedDoc!: TypeDocHeader;
  @Input() NettAmount!: number;
  @Input() ProductionDoc: boolean = false;
  @Input() AvoidCashEftDetails: boolean = false;

  @Output() newDocEvent = new EventEmitter<TypeDocHeader>();
  @Output() newDocRef   = new EventEmitter<TypeTransactions>();
 
  Issue_No: string = "";
  Issue_Date: number = 0;
  Issue_Qty: number= 0;
  Issue_GrossWt: number= 0;
  Issue_NettWt: number= 0;
  Issue_Value: number= 0;  
  Issue_PureWt: number = 0;
  Issue_Purity: number = 0;
  Expect_Silver: number= 0;
  


  ngOnInit(){              
    let ser = new ClsVoucherSeries(this.dataService);
    ser.getSeriess(0,this.SelectedDoc.VouTypeSno).subscribe(data => {         
      this.SeriesList = JSON.parse (data.apiData);         
      if  (this.SelectedDoc.TransSno == 0 )
        {
          this.SelectedDoc.Series = this.SeriesList[0];          
          this.GetVoucherNumber();
        }      
    });    
    
    this.LoadBanks();

    let trans = new ClsTransactions(this.dataService);
    switch (this.SelectedDoc.VouTypeSno) {
      case this.globals.VTypSmeltingReceipt:
        trans.getPendingSmeltingIssues().subscribe(data => {               
          this.RefList = JSON.parse (data.apiData);          
        });
        break;

      case this.globals.VTypRefiningReceipt:
        trans.getPendingRefiningIssues().subscribe(data => {      
          this.RefList = JSON.parse (data.apiData);          
        });
        break;      

      case this.globals.VTypCastingReceipt:
      trans.getPendingCastingIssues().subscribe(data => {      
        this.RefList = JSON.parse (data.apiData);        
      });
      break;      

      case this.globals.VTypSalesInvoice:
      trans.getPendingDeliveryDocs().subscribe(data => {           
        this.RefList = JSON.parse (data.apiData);                 
      });
      break;   
      
      case this.globals.VTypJobworkDelivery:
      trans.getPendingJobworkInwards().subscribe(data => {           
        this.RefList = JSON.parse (data.apiData);                 
      });
      break;   

      case this.globals.VTypBuyingContract:
        trans.getPendingPurchaseOrders().subscribe(data => {           
          this.RefList = JSON.parse (data.apiData);                 
        });
        break; 

      case this.globals.VTypBuyingReceipt:
      trans.getPendingPurchaseOrders().subscribe(data => {           
        this.RefList = JSON.parse (data.apiData);                 
      });
      break; 

      case this.globals.VTypDeliveryDoc:
        trans.getPendingSalesOrders().subscribe(data => {           
          this.RefList = JSON.parse (data.apiData);                 
        });
        break; 
    }  

    if (this.SelectedDoc.Reference){      
      this.Issue_No = this.SelectedDoc.Reference.Trans_No!;
      this.Issue_Date = this.SelectedDoc.Reference.Trans_Date!;
      this.Issue_Qty = this.SelectedDoc.Reference.TotQty!;
      this.Issue_GrossWt = this.SelectedDoc.Reference.TotGrossWt!;
      this.Issue_NettWt = this.SelectedDoc.Reference.TotNettWt!;    
      this.Issue_Value = this.SelectedDoc.Reference.NettAmt!; 
      this.Issue_PureWt = this.SelectedDoc.Reference.TotPureWt!;
      this.Issue_Purity = this.SelectedDoc.Reference.TotPurity!;
      this.Expect_Silver = this.SelectedDoc.Reference.TotSilverWt!;
    }
  } 

  ngOnChanges(changes: SimpleChanges){                 
    this.NettAmount = +changes['NettAmount'].currentValue;       
    this.SelectedDoc.Cash_Amount = this.NettAmount - this.SelectedDoc.Bank_Amount;
  }

  LoadBanks(){ 
    let led = new ClsLedger(this.dataService);
    led.getBankAccounts().subscribe(data => {      
      this.BanksList = JSON.parse (data.apiData);      
    })
  }

  GetVoucherNumber(){
    let ser = new ClsVoucherSeries(this.dataService);
    ser.getSeriess(this.SelectedDoc.Series.SeriesSno,0).subscribe(data=> {

      let trans = new ClsTransactions(this.dataService);
      switch (JSON.parse(data.apiData)[0].Num_Method) {
        case 0:
          this.SelectedDoc.Trans_No = '';
          break;

        case 1:                    
          trans.getVoucherNumber(this.SelectedDoc.Series.SeriesSno).subscribe(data =>{
            this.SelectedDoc.Trans_No = data.apiData;
          });
          break;      

        case 2:                  
          trans.getVoucherNumber(this.SelectedDoc.Series.SeriesSno).subscribe(data =>{
            this.SelectedDoc.Trans_No = data.apiData;
          });
          this.AutoVouNo = true;
          break;
      }      
    });    
  }

  getSeries($event: TypeVoucherSeries){
    this.SelectedDoc.Series = $event;    
    this.GetVoucherNumber();
    this.newDocEvent.emit(this.SelectedDoc);
  }

  getBank($event: TypeLedger){
    this.SelectedDoc.Bank = $event;
  }

  getReference($event: TypeTransactions){            
    this.Issue_No = ""; 
    this.Issue_Date = 0;
    this.Issue_Qty = 0;
    this.Issue_GrossWt = 0; 
    this.Issue_NettWt = 0;
    this.Issue_Value = 0;
    this.Issue_PureWt = 0;
    this.Expect_Silver = 0;
    this.Issue_Purity  = 0;
    
    this.SelectedDoc.Reference = $event;    
    this.newDocEvent.emit(this.SelectedDoc);
    if (this.SelectedDoc.Reference){
      this.newDocRef.emit(this.SelectedDoc.Reference);      
    }    

    this.Issue_No = this.SelectedDoc.Reference.Trans_No!;
    this.Issue_Date = this.SelectedDoc.Reference.Trans_Date!;
    this.Issue_Qty = this.SelectedDoc.Reference.TotQty!;
    this.Issue_GrossWt = this.SelectedDoc.Reference.TotGrossWt!;
    this.Issue_NettWt = this.SelectedDoc.Reference.TotNettWt!;    
    this.Issue_Value = this.SelectedDoc.Reference.NettAmt!;
    this.Issue_PureWt = this.SelectedDoc.Reference.TotPureWt!;
    this.Expect_Silver = this.SelectedDoc.Reference.TotSilverWt!;
    this.Issue_Purity = this.SelectedDoc.Reference.TotPurity!;
  }
 
  DateToInt($event: any): number{        
    return this.globals.DateToInt( new Date ($event.target.value));
  }

  UpdateChanges(){    
    this.newDocEvent.emit(this.SelectedDoc);
  }

  getNewBank($event: TypeLedger){            
    this.LoadBanks();    
    this.SelectedDoc.Bank = $event;    
  }

  CalcCashAmount($event: any) {
    if ($event.target.value > this.NettAmount){
      $event.target.value = 0;
      this.SelectedDoc.Cash_Amount = this.NettAmount;
      return;
    }
    this.SelectedDoc.Cash_Amount = this.NettAmount - $event.target.value;
  }
}
