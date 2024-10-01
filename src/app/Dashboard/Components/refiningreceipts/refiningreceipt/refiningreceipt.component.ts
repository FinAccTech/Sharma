import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { ClsParties, TypeParties } from 'src/app/Dashboard/Classes/ClsParties';
import { ClsTransactions, TypeTransactions } from 'src/app/Dashboard/Classes/ClsTransactions';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { TypeDocHeader } from 'src/app/Dashboard/Types/TypeDocHeader';
import { TypeGridItem } from 'src/app/Dashboard/Types/TypeGridItem';
import { TypeItemGridTotals } from 'src/app/Dashboard/Types/TypeItemGridTotals';
import { FileHandle } from 'src/app/Dashboard/Types/file-handle';
import { GlobalsService } from 'src/app/globals.service';
import { MatDialog } from '@angular/material/dialog';
import { ProgressbroadcastService } from 'src/app/Dashboard/Services/progressbroadcast.service';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-refiningreceipt',
  templateUrl: './refiningreceipt.component.html',
  styleUrls: ['./refiningreceipt.component.scss']
})

export class RefiningreceiptComponent implements OnInit {
  
  constructor( private progressService: ProgressbroadcastService,  private dataService: DataService, private globals: GlobalsService, private location: Location, private activatedRoute: ActivatedRoute, private dialog:MatDialog) {
    this.activatedRoute.paramMap.subscribe(paramMap => {       
      this.Transaction = JSON.parse (paramMap.get('trans')!);       
  });
   
  }

  NettAmount: number = 0;
  GridList!:            TypeGridItem[];   
  GridTotals!:          TypeItemGridTotals;
  
  TransImages:          FileHandle[] = [];

  Transaction!: TypeTransactions;

  SelectedDoc: TypeDocHeader = {
    TransSno: 0,
    VouTypeSno: this.globals.VTypRefiningReceipt,
    Series: {SeriesSno:0, Series_Name: "", VouTypeSno: this.globals.VTypRefiningReceipt},
    Trans_No:"",
    Trans_Date: this.globals.DateToInt(new Date()),
    Due_Date : this.globals.DateToInt(new Date()),
    Reference: {TransSno:0,Trans_Date:0, VouTypeSno:0, Party: { PartySno:0, Party_Code:"", Party_Name:"" }},
    Cash_Amount:0,
    Bank_Amount:0,
    Bank: {"LedSno":0,"Led_Name":"" },
    Bank_Details:""
  };


   
  RefList: any[] = [];
  // For Validations  
  BillDetailsInvalid: boolean = false;
  PartyInvalid: boolean = false;
  ItemDetailsInvalid: boolean = false;


  ngOnInit(): void {    

    if (this.Transaction.TransSno === 0)
      {
        this.AddNewTransaction();
      }
    else{
      
      this.Transaction.Series = JSON.parse(this.Transaction.Series_Json!)[0]; 
      this.Transaction.Party = JSON.parse(this.Transaction.Party_Json!)[0];
      
      console.log (this.Transaction);

      if (this.Transaction.Ref_Json?.length !==0){
        this.SelectedDoc.Reference = JSON.parse(this.Transaction.Ref_Json!)[0];   
      }
      
      

      if (this.Transaction.Bank_Json?.length !==0){
        this.SelectedDoc.Bank = JSON.parse(this.Transaction.Bank_Json!);
      }


      this.SelectedDoc.TransSno = this.Transaction.TransSno;
      this.SelectedDoc.VouTypeSno = this.globals.VTypRefiningReceipt;
      this.SelectedDoc.Series = this.Transaction.Series!;
      
      this.SelectedDoc.Trans_No = this.Transaction.Trans_No!;
      this.SelectedDoc.Trans_Date = this.Transaction.Trans_Date;
      this.SelectedDoc.Due_Date = this.Transaction.Due_Date!;
      this.SelectedDoc.Cash_Amount = this.Transaction.Cash_Amount!;
      this.SelectedDoc.Bank_Amount = this.Transaction.Bank_Amount!;      
      this.SelectedDoc.Bank_Details = this.Transaction.Bank_Details!;


      if (this.Transaction.Images_Json?.length !==0)
        {
          this.TransImages = JSON.parse(this.Transaction.Images_Json!);
          this.Transaction.fileSource = JSON.parse (this.Transaction.Images_Json!);
        } 

      this.GridList = JSON.parse (this.Transaction.Items_Json!);
      this.GridTotals = { TotQty: this.Transaction.TotQty! , TotGrossWt: this.Transaction.TotGrossWt!, TotStoneWt: this.Transaction.TotStoneWt!, TotNettWt: this.Transaction.TotNettWt!, TotSilverWt: this.Transaction.TotSilverWt!, TotPureWt: this.Transaction.TotPureWt!, TotPureSilverWt: this.Transaction.TotPureSilverWt!, TaxableValue:0,  TotValue: this.Transaction.TotAmount!};
    }
   
  }
  
  AddNewTransaction(){
    let trans = new ClsTransactions(this.dataService);        
    this.Transaction = trans.Initialize();       
    this.InitializeGrid();
  }

  InitializeGrid(){
    this.GridList = this.globals.GetGridList();    
    this.GridList[0].Qty = 1;
    this.GridTotals = this.globals.GetGridTotal();
  }

  SaveTransaction(){        

    this.Transaction.Series       = this.SelectedDoc.Series;
    this.Transaction.Trans_No     = this.SelectedDoc.Trans_No;
    this.Transaction.Trans_Date   = this.SelectedDoc.Trans_Date;
    this.Transaction.Due_Date     = this.SelectedDoc.Due_Date;
    this.Transaction.RefSno       = this.SelectedDoc.Reference.TransSno;
    this.Transaction.Cash_Amount  = this.SelectedDoc.Cash_Amount;
    this.Transaction.Bank_Amount  = this.SelectedDoc.Bank_Amount;
    this.Transaction.BankLedSno   = this.SelectedDoc.Bank.LedSno;
    this.Transaction.Bank_Details = this.SelectedDoc.Bank_Details;

    if (this.ValidateInputs() == false) {return};    
    
    let trans = new ClsTransactions(this.dataService);
    trans.Trans = this.Transaction;    
    trans.Trans.ItemDetailXML   = this.globals.GenerateItemXML(this.GridList);
    trans.Trans.ImageDetailXML  = this.globals.GenerateImageXML(this.TransImages);
    trans.Trans.BatchDetailXML = this.globals.GenerateBatchXML([]);
    
    trans.Trans.fileSource      = this.Transaction.fileSource;

    this.progressService.sendUpdate("start","Saving Refining Receipt");
    trans.saveTransaction().subscribe(data => {
      this.progressService.sendUpdate("stop","");
        if (data.queryStatus == 0) {
          this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
          return;
        }
        else{          
          this.GoBack();                  
          this.globals.SnackBar("info", this.Transaction.TransSno == 0 ? "Refining Receipt Created successfully" : "Refining Receipt updated successfully",2000);           
        }
    }, 
    error => {
      this.progressService.sendUpdate("stop","");
      this.globals.ShowAlert(this.globals.DialogTypeError, error);
    }
    )
  }

  DeleteTransaction(){
    if (this.Transaction.TransSno == 0){
      this.globals.SnackBar("error", "No Contracct selected to delete",1200);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this Refining Receipt?").subscribe(Response => {      
      if (Response == 1){
        let itm = new ClsTransactions(this.dataService);
        itm.Trans = this.Transaction;
        itm.deleteTransaction().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "Refining Receipt deleted successfully",1500);            
            
          }
        })        
      }
    })
  }

  DateToInt($event: any): number{    
    return this.globals.DateToInt( new Date ($event));
  }

  ValidateInputs(): boolean{                    
    this.PartyInvalid = false;
    this.BillDetailsInvalid = false;
    this.ItemDetailsInvalid = false;
    this.Transaction.fileSource      = this.TransImages;
    
    
    if (!this.Transaction.Series || !this.Transaction.Trans_No ){
      this.BillDetailsInvalid = true;
      this.globals.SnackBar("error","Transaction Number Invalid",1000);
      return false;
    }

    if (!this.Transaction.RefSno || this.Transaction.RefSno == 0 ){
      this.BillDetailsInvalid = true;
      this.globals.SnackBar("error","Reference Number Invalid",1000);
      return false;
    }

    if (this.Transaction.Party.PartySno === 0){
      this.PartyInvalid = true;
      this.globals.SnackBar("error","Client Details Invalid",1000);
      return false;
    }

    
    for (let i=0; i<this.GridList.length;i++)
      {
        if (!this.GridList[i].Item || this.GridList[i].Item.ItemSno == 0 || !this.GridList[i].Uom || this.GridList[i].Uom.UomSno == 0){        
          this.globals.SnackBar("error","Invalid Item Details...",1000)
          this.ItemDetailsInvalid = true;
          return false;        
        }
        else{
          this.ItemDetailsInvalid = false;
        }
      }

    if (this.Transaction.TotQty == 0 || this.Transaction.TotNettWt == 0  ){
      this.ItemDetailsInvalid = true;
      this.globals.SnackBar("error","Item Details Invalid",1000);
      return false;
    }
    
    return true;    
  }

  getParty($event: TypeParties){    
    this.Transaction.Party = $event;    
  }

  getNewReference($event: TypeTransactions){
   //if (this.SelectedDoc.Reference && this.SelectedDoc.Reference.TransSno !== 0){    
    if (this.SelectedDoc.Reference.TransSno && this.SelectedDoc.Reference.TransSno !== 0){    
      let trans = new ClsTransactions(this.dataService);
      this.progressService.sendUpdate("start","Getting Issue Details. Hold on");
      trans.getTransactions(this.SelectedDoc.Reference.TransSno, this.globals.VTypRefiningIssue,0,0,0 ).subscribe(data => { 
        
        this.progressService.sendUpdate("stop","");               
        this.Transaction.Party = JSON.parse (JSON.parse (data.apiData)[0].Party_Json)[0];

        this.GridList = [
          {            
            // "Item": { "ItemSno": this.SelectedDoc.Reference.CompSno==1 ?  1 : 4, "Item_Code": "I1", "Item_Name": "AU", "Name": "AU", "Details": "Code:" + "I1" }, "Karat": 24, "PurityPer": 100, "Remarks": "Refined Gold", "Qty": 1,
            // "GrossWt": this.SelectedDoc.Reference.TotGrossWt!, "NettWt": this.SelectedDoc.Reference.TotNettWt!, "Wastage": 0, "SilverWt": this.SelectedDoc.Reference.TotSilverWt!, "SilverPurity":0,
            // "Uom": { "UomSno": 1, "Uom_Code": "U1", "Uom_Name": "Grams", "Base_Qty": 0, "Name":"Grams", "Details": "Code: " + "U1" }, Rate: 0, Amount:  this.SelectedDoc.Reference.NettAmt!,
            // PureWt: 0, PureSilverWt:0,
            // BatchSno: 0,
            // Batch_No: '',
            // StoneWt: 0,
            // BatchItems: this.SelectedDoc.Trans_No + "/1"

            "Item": { "ItemSno": this.SelectedDoc.Reference.CompSno==1 ?  1 : 4, "Item_Code": "I1", "Item_Name": "AU", "Name": "AU", "Details": "Code:" + "I1" }, "Karat": 24, "PurityPer": 100, "Remarks": "Refined Gold", "Qty": 1,
            "GrossWt": 0, "NettWt": 0, "Wastage": 0, "SilverWt": 0, "SilverPurity":0,
            "Uom": { "UomSno": 1, "Uom_Code": "U1", "Uom_Name": "Grams", "Base_Qty": 0, "Name":"Grams", "Details": "Code: " + "U1" }, Rate: 0, Amount:  0,
            PureWt: 0, PureSilverWt:0,
            BatchSno: 0,
            Batch_No: '',
            StoneWt: 0,
            BatchItems: this.SelectedDoc.Trans_No + "/1"
          },

          {
            "Item": { "ItemSno": this.SelectedDoc.Reference.CompSno==1 ?  1 : 4, "Item_Code": "I1", "Item_Name": "AU", "Name": "AU", "Details": "Code:" + "I1" }, "Karat": 24, "PurityPer": 100, "Remarks": "Undissolved Gold", "Qty": 1,
            "GrossWt": 0, "NettWt": 0, "Wastage": 0, "SilverWt":0, "SilverPurity":0,
            "Uom": { "UomSno": 1, "Uom_Code": "U1", "Uom_Name": "Grams", "Base_Qty": 0, "Name":"Grams", "Details": "Code: " + "U1" }, Rate: 0, Amount: 0,
            PureWt: 0, PureSilverWt:0,
            BatchSno: 0,
            Batch_No: '',
            StoneWt: 0,
            BatchItems: this.SelectedDoc.Trans_No + "/1"
          },
          
          {
            "Item": { "ItemSno": this.SelectedDoc.Reference.CompSno==1 ?  1 : 4, "Item_Code": "I1", "Item_Name": "AU", "Name": "AU", "Details": "Code:" + "I1" }, "Karat": 24, "PurityPer": 100, "Remarks": "Au in Ag cloride", "Qty": 1,
            "GrossWt": 0, "NettWt": 0, "Wastage": 0, "SilverWt":0, "SilverPurity":0,
            "Uom": { "UomSno": 1, "Uom_Code": "U1", "Uom_Name": "Grams", "Base_Qty": 0, "Name":"Grams", "Details": "Code: " + "U1" }, Rate: 0, Amount: 0,
            PureWt: 0, PureSilverWt:0,
            BatchSno: 0,
            Batch_No: '',
            StoneWt: 0,
            BatchItems: this.SelectedDoc.Trans_No + "/1"
          },

          {
            "Item": { "ItemSno": this.SelectedDoc.Reference.CompSno==1 ?  2 : 5, "Item_Code": "I2", "Item_Name": "AG", "Name": "AG", "Details": "Code:" + "I2" }, "Karat": 24, "PurityPer": 100, "Remarks": "Silver", "Qty": 1,
            "GrossWt": 0, "NettWt": 0, "Wastage": 0, "SilverWt":0, "SilverPurity":0,
            "Uom": { "UomSno": 1, "Uom_Code": "U1", "Uom_Name": "Grams", "Base_Qty": 0, "Name":"Grams", "Details": "Code: " + "U1" }, Rate: 0, Amount: 0,
            PureWt: 0, PureSilverWt:0,
            BatchSno: 0,
            Batch_No: '',
            StoneWt: 0,
            BatchItems: this.SelectedDoc.Trans_No + "/1"
          },

          {
            "Item": { "ItemSno": this.SelectedDoc.Reference.CompSno==1 ?  1 : 4, "Item_Code": "I1", "Item_Name": "AU", "Name": "AU", "Details": "Code:" + "I1" }, "Karat": 24, "PurityPer": 100, "Remarks": "Recovery Gold", "Qty": 1,
            "GrossWt": 0, "NettWt": 0, "Wastage": 0, "SilverWt":0, "SilverPurity":0,
            "Uom": { "UomSno": 1, "Uom_Code": "U1", "Uom_Name": "Grams", "Base_Qty": 0, "Name":"Grams", "Details": "Code: " + "U1" }, Rate: 0, Amount: 0,
            PureWt: 0, PureSilverWt:0,
            BatchSno: 0,
            Batch_No: '',
            StoneWt: 0,
            BatchItems: this.SelectedDoc.Trans_No + "/1"
          },
      ]
      },       
      error => { 
        this.progressService.sendUpdate("stop","");
        this.globals.ShowAlert(this.globals.DialogTypeError, error);
      });
    }        
      else{
        let pty = new ClsParties(this.dataService);      
        this.Transaction.Party = pty.Initialize();
        // this.DocConversion = false;
        this.GridList = [];    
    }
  }

  getDocHeader($event: TypeDocHeader){  
    this.SelectedDoc = $event;     
  }

  getGridDetails($event: TypeGridItem[]){    
    this.GridList = $event;  
  }

  getGridTotals($event: TypeItemGridTotals){    
    this.GridTotals = $event;
    this.Transaction.TotQty = this.GridTotals.TotQty;
    this.Transaction.TotGrossWt = this.GridTotals.TotGrossWt;
    this.Transaction.TotStoneWt = this.GridTotals.TotStoneWt;
    this.Transaction.TotNettWt = this.GridTotals.TotNettWt;
    this.Transaction.TotSilverWt = this.GridTotals.TotSilverWt;
    this.Transaction.TotPureWt = this.GridTotals.TotPureWt;
    this.Transaction.TotPureSilverWt = this.GridTotals.TotPureSilverWt;
    
    this.Transaction.TotAmount = +this.GridTotals.TotValue.toFixed(2) ;
    this.Transaction.TaxAmount = +(this.Transaction.TotAmount * (+this.Transaction.TaxPer! /100)).toFixed(2);
    this.Transaction.RevAmount = this.Transaction.TaxAmount;
    this.Transaction.NettAmt = +((this.Transaction.TotAmount + this.Transaction.TaxAmount)-this.Transaction.RevAmount).toFixed(2);   
    
    this.NettAmount = this.Transaction.NettAmt; 
  }

  getTransImages($event: FileHandle[]){    
    this.TransImages = $event;  
  }


  CanExit()
  {
    return confirm ("You have unsaved changes. Do you want to exit anyway?")
  }
  GoBack(){
    this.location.back();
  }

  PrintTransaction(trans: TypeTransactions){    
    let Trans = new ClsTransactions(this.dataService);
    Trans.getLockStatus(trans.TransSno).subscribe(data =>{
      if (data.apiData == 1){
        this.globals.ShowAlert(3,"This Document is already printed and Locked..");
        return;        
      }
      else{
        trans.Series = JSON.parse(trans.Series_Json!)[0];
        trans.Party = JSON.parse(trans.Party_Json!)[0];    
        Trans.UpdateLockStatus(trans.TransSno).subscribe(data =>{
          if (data.apiData == 1){
            this.globals.PrintVoucher(trans);    
          }          
          else{
            this.globals.ShowAlert(3,"Error updating the Transaction..");
        return;        
          }
        })        
      }
    });    
  }
}
