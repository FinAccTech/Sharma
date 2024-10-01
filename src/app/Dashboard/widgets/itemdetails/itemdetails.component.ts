import { Component, ElementRef, EventEmitter, Input, IterableDiffer, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog          } from '@angular/material/dialog';
import { TypeGridItem       } from '../../Types/TypeGridItem';
import { FileHandle         } from '../../Types/file-handle';
import { TypeItemGridTotals } from '../../Types/TypeItemGridTotals';
import { ClsItem, TypeItem  } from '../../Classes/ClsItems';
import { DataService        } from '../../Services/dataservice';
import { GlobalsService     } from 'src/app/globals.service';
import { ClsUom, TypeUom    } from '../../Classes/ClsUoms';
import { ImagesComponent    } from '../images/images.component';
import { StockselectionComponent } from '../stockselection/stockselection.component';
import { ClsTransactions, TypeTransactions } from '../../Classes/ClsTransactions';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-itemdetails',
  templateUrl: './itemdetails.component.html',
  styleUrls: ['./itemdetails.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush ,
}) 

export class ItemdetailsComponent implements OnInit, OnChanges  {
  
  @Input()  GridDataSource: TypeGridItem[] = []; // Input GridList as Input Param
  @Output() newGridEvent = new EventEmitter<any>(); // Output New GridList as Output Param

  @Input()  TransImages: FileHandle[] = []; // Input Item Images as Input Param
  @Output() newTransImages = new EventEmitter<any>(); // Output New Imgages as Output Param

  @Input()  GridTotals!: TypeItemGridTotals;
  @Output() newGridTotal = new EventEmitter<any>(); // Output New Imgages as Output Param

  @Input()  VouTypeSno: number = 0; 
  @Input()  DisabledDiv: boolean = false;
  @Input()  DisableAmtCols: boolean = false;
  @Input()  StockInput: boolean = false; 
  @Input()  EnableBatch: boolean = false; 
  @Input()  EnableBatchGeneration: boolean = false; 
  @Input()  SkipRowCalculation: boolean = false; 
  @Input()  DocNo: string = "";  
  @Input()  WastageCol: boolean = false; 
  @Input()  DisableRowAlter: boolean = false; 
  @Input()  DocConversion: boolean = false; 

  @Input()  SmeltingReceipt: boolean = false; 
  @Input()  SilverWt: boolean = false;  
  @Input()  ManualAmount: boolean = false;  
  @Input()  SingleItem: boolean = false;   // To avoid caclulating the nettwt from loop. nettwt will be fixed and dont want to deduct from stone wt etc.,
  @Input()  ShowPureWt: boolean = false;  

  @ViewChild('batchno') batchno!: ElementRef;
  @ViewChild('qty') qty!: ElementRef;
  @ViewChild('stonewt') stonewt!: ElementRef;
  @ViewChild('nettwt') nettwt!: ElementRef;
  @ViewChild('wastage') wastage!: ElementRef;
  
  GridList: TypeGridItem[] = [];  
  ItemsList!: TypeItem[];
  SelectedItem: TypeItem[] = [];  
  UomList!: TypeUom[];
  SelectedUom: TypeUom[] = [];
  
  //Validate Inputs
  ItemNameValid: boolean = true;
  QtyValid: boolean = true;
  GrossWtValid: boolean = true;
  StonWtValid: boolean = true;
  NettWtValid: boolean = true;  
  ValueValid: boolean = true;
  UomValid: boolean = true;

  iterableDiffer: IterableDiffer<TypeGridItem> | null;

  errorItem: boolean[] = [];
  errorQty: boolean[] = [];
  errorPurity: boolean[] = [];
  errorNettWt: boolean[] = [];
  errorUom: boolean[] = [];
  errorKarat: boolean[] = [];
  errorAmt: boolean[] = [];

  CommonRate: number = 0;

  StockRegisterList!: TypeTransactions[];
  
  constructor(private dataService: DataService, private globals: GlobalsService, private dialog: MatDialog, private iterableDiffers: IterableDiffers){
    this.iterableDiffer = iterableDiffers.find(this.GridList).create(); 
  } 


  ngDoCheck() 
  {        
      this.PushGridDetailstoParent();    
  }

  ngOnInit(): void {   
    if (this.VouTypeSno == 0){
      alert ("VouTypeSno not given");
      return;
    }
    this.LoadItems();    
    this.LoadUoms();
    if (this.StockInput) {  this.LoadStockRegisterList(); }

    this.GridList = this.GridDataSource;        
    if (this.GridList)
    {    
      for (let i=0; i<this.GridList.length;i++)
      {
        this.SelectedItem[i]=this.GridList[i].Item;
        this.SelectedUom[i]=this.GridList[i].Uom;        
      }
    }   
  }
  
  ngOnChanges(changes: SimpleChanges) {               
     if (changes['GridDataSource']){   
      this.GridList = changes['GridDataSource'].currentValue;
      for (let i=0; i<this.GridList.length;i++)
        {
          this.SelectedItem[i]=this.GridList[i].Item;
          this.SelectedUom[i]=this.GridList[i].Uom;        
        }
     }  

  }

  SetBatchItems(){        
    if (this.StockInput || !this.EnableBatchGeneration ) {return};
    let batchString ="";
    let currNo= 0;
    for (var i=0; i< this.GridList.length; i++){
      batchString = "";
      for (var a=0; a< this.GridList[i].Qty; a++){
        batchString += this.DocNo+"/"+(currNo+1) +", ";  
        currNo ++;
      }
      this.GridList[i].BatchItems = batchString;
    }
  }

  LoadItems(){
    let it = new ClsItem(this.dataService);
    it.getItems(0).subscribe(data=> {        
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
        return;
      }
      else{          
        this.ItemsList = JSON.parse (data.apiData);          
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError,error);
      return;             
    });
  }

  LoadUoms(){
    let ct = new ClsUom(this.dataService);
      ct.getUoms(0).subscribe(data=> {
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
  
  PushGridDetailstoParent(){                
    this.SetTotals();
    this.newGridEvent.emit(this.GridList);
    this.newGridTotal.emit(this.GridTotals);
  }
   
  AddItem()
  {    
    for (let i=0; i<this.GridList.length;i++)
    {
      if ( !this.GridList[i].Item || this.GridList[i].Item.ItemSno == 0  ){        
        this.globals.SnackBar("error","Invalid Item Details...",1000)
        this.errorItem[i]= true;
        return;        
      }
      else{
        this.errorItem[i]= false;
      }

      if (!this.GridList[i].Qty || this.GridList[i].Qty == 0  ){        
        //this.globals.SnackBar("error","Invalid Item Details...",1000)
        this.errorQty[i]= true;
        return;        
      }
      else{
        this.errorQty[i]= false;
      }

      if (!this.GridList[i].NettWt || this.GridList[i].NettWt == 0  ){        
        //this.globals.SnackBar("error","Invalid Item Details...",1000)
        this.errorNettWt[i]= true;
        return;        
      }
      else{
        this.errorNettWt[i]= false;
      }

      if (!this.GridList[i].Uom || this.GridList[i].Uom.UomSno == 0  ){        
        //this.globals.SnackBar("error","Invalid Item Details...",1000)
        this.errorUom[i]= true;
        return;        
      }
      else{
        this.errorUom[i]= false;
      }
      
      if (!this.GridList[i].Karat || this.GridList[i].Karat == 0  ){        
        //this.globals.SnackBar("error","Invalid Item Details...",1000)
        this.errorKarat[i]= true;
        return;        
      }
      else{
        this.errorKarat[i]= false;
      }

      if (!this.GridList[i].Amount || this.GridList[i].Amount == 0  ){        
        //this.globals.SnackBar("error","Invalid Item Details...",1000)
        this.errorAmt[i]= true;
        return;         
      } 
      else{
        this.errorAmt[i]= false;
      }
    }
 
    let item = { "Item": {"ItemSno":0, "Item_Code": '', "Item_Name": '', "Name" : '', "Details" :'' } , "BatchSno":0, "Batch_No":"",  "Qty": this.WastageCol ? 1: 0, "StoneWt": 0, "GrossWt": 0, "Wastage": 0, "NettWt": 0, "SilverWt":0, "SilverPurity":0, "PureWt":0, "PureSilverWt":0,  "Uom":{"UomSno":0, "Uom_Code": "", "Uom_Name": "" }, "Karat":0, "PurityPer" :0, "Rate":0, "Amount": 0, "Remarks": "", "BatchItems" :"" } ;
    this.GridList.push(item); 
    this.errorItem.push(false);
    this.SelectedItem.push(item.Item);
  }

  RemoveItem(index: number){
    console.log(index);
    
      this.GridList.splice(index,1);
      this.errorItem.splice(index,1);
      if (this.GridList.length == 0){
        this.AddItem();
      }
      if (this.GridList)
        {    
          for (let i=0; i<this.GridList.length;i++)
          {
            this.SelectedItem[i]=this.GridList[i].Item;
            this.SelectedUom[i]=this.GridList[i].Uom;        
          }
        }   
        
  }

  getItems() {    
    //console.log (this.GridList);
  }

  CalcValues(item: TypeGridItem){       
    if (this.SmeltingReceipt){
      this.GridList[0].NettWt = (this.GridList[0].GrossWt - this.GridList[0].Wastage - this.GridList[1].NettWt)
      this.GridList[1].NettWt = (this.GridList[1].GrossWt - this.GridList[1].Wastage)      

      this.GridList[0].PureWt = this.GridList[1].NettWt * (this.GridList[1].PurityPer / 100)
      this.GridList[1].PureSilverWt = (this.GridList[1].SilverWt)      
    }
    else{       
      if (this.SkipRowCalculation == false){
        item.NettWt = item.GrossWt - item.StoneWt - item.Wastage;    
        if (this.ManualAmount == false)                  {
          item.Amount = +(item.NettWt * item.Rate!).toFixed(2);             
        }        
      }      

      if (this.SilverWt){
        item.SilverWt = +(item.NettWt * (item.SilverPurity/100)).toFixed(3);
      }
    }      

    item.PureWt = +(item.NettWt * (item.PurityPer /100)).toFixed(3);
    item.PureSilverWt = +(item.SilverWt).toFixed(3);
  }

  OpenImagesCreation(){
    var img = this.TransImages; 
  
    const dialogRef = this.dialog.open(ImagesComponent, 
      {         
        width:"50vw",
        height:"60vh",        
        data: {img},
      });
      
      dialogRef.disableClose = true;
  
      dialogRef.afterClosed().subscribe(result => {        
        this.TransImages = result;        
      }); 
  }

  SetTotals() {      
  
    this.GridTotals.TotQty = 0;
    this.GridTotals.TotGrossWt = 0;
    this.GridTotals.TotStoneWt = 0;
    this.GridTotals.TotNettWt = 0;
    this.GridTotals.TotSilverWt = 0;
    
    this.GridTotals.TotPureWt = 0;
    this.GridTotals.TotPureSilverWt = 0;

    this.GridTotals.TotValue = 0;
    this.GridTotals.TaxableValue = 0;

    if (this.SmeltingReceipt && this.GridList && this.GridList.length==2 ){
      this.GridTotals.TotQty =  this.GridList[0].Qty + this.GridList[1].Qty;
      this.GridTotals.TotGrossWt =  this.GridList[0].GrossWt ;
      this.GridTotals.TotNettWt =  this.GridList[0].NettWt;
      this.GridTotals.TotSilverWt =  this.GridList[0].SilverWt;
      this.GridTotals.TotPureWt = this.GridList[0].PureWt;;
      this.GridTotals.TotPureSilverWt = this.GridList[0].PureSilverWt;;
      this.GridTotals.TotValue =  this.GridList[0].Amount - this.GridList[1].Amount;
    }
    else
    {
      if (this.GridList)
        {
          for (let i=0; i<this.GridList.length; i++){
            this.GridTotals.TotQty +=  (+this.GridList[i].Qty);
            
            if (this.GridList[i].Uom.Base_Qty == 0)
              {
                if ((this.GridList[i].Item.Item_Name == "AG") && (this.VouTypeSno ==this.globals.VTypRefiningReceipt)){
                  this.GridTotals.TotSilverWt +=  +this.GridList[i].GrossWt;                  
                }
                else{
                  this.GridTotals.TotGrossWt +=  +this.GridList[i].GrossWt;
                }
                
              }
            else
            {
              if ((this.GridList[i].Item.Item_Name == "AG") && (this.VouTypeSno ==this.globals.VTypRefiningReceipt)){
                this.GridTotals.TotSilverWt +=  (+this.GridList[i].GrossWt * +this.GridList[i].Uom.Base_Qty!);                
              }
              else{
                this.GridTotals.TotGrossWt +=  (+this.GridList[i].GrossWt * +this.GridList[i].Uom.Base_Qty!);
              }
              
            }        
            
            this.GridTotals.TotStoneWt +=  +this.GridList[i].StoneWt;
            if (this.SingleItem){
                this.GridTotals.TotNettWt += +(this.GridList[i].NettWt);
            }
            else{
              this.GridTotals.TotNettWt = (+(this.GridTotals.TotGrossWt -  this.GridTotals.TotStoneWt));
            }
            
            
            
            this.GridTotals.TotSilverWt +=  +this.GridList[i].SilverWt;
            if ((this.GridList[i].Item.Item_Name == "AG") && (this.VouTypeSno ==this.globals.VTypRefiningReceipt)){
              this.GridTotals.TotPureSilverWt +=  +this.GridList[i].PureSilverWt;
            }
            else{
              this.GridTotals.TotPureWt +=  +this.GridList[i].PureWt;
            }
            
            this.GridTotals.TaxableValue +=   (this.GridList[i].Karat === 24 ? 0 : +this.GridList[i].Amount);
            this.GridTotals.TotValue += +this.GridList[i].Amount;        
          }
    
          this.GridTotals.TotGrossWt =  +(this.GridTotals.TotGrossWt).toFixed(3);
          this.GridTotals.TotStoneWt =  +(this.GridTotals.TotStoneWt).toFixed(3);
          this.GridTotals.TotNettWt =  +(this.GridTotals.TotNettWt).toFixed(3);
          this.GridTotals.TotSilverWt =  +(this.GridTotals.TotSilverWt).toFixed(3);
          this.GridTotals.TotPureWt =  +(this.GridTotals.TotPureWt).toFixed(3);
          this.GridTotals.TotValue =  +(this.GridTotals.TotValue).toFixed(2);
        }
    }
    
    this.newGridTotal.emit(this.GridTotals);
  }

  UpdateRates(){
    for (let i=0; i<this.GridList.length; i++){
        this.GridList[i].Rate =  this.GridList[i].Rate + ((this.CommonRate / 100)* this.GridList[i].Rate);
        this.CalcValues(this.GridList[i]);
      }
      this.SetTotals();
  }

  getItem($event: TypeItem,index: number){     
    this.SelectedItem[index] = $event;    
    this.GridList[index].Item = $event;    
  }

  getUom($event: TypeUom,index: number){            
    this.SelectedUom[index] = $event;    
    this.GridList[index].Uom = $event;    
  }

  
  getNewMaster($event: TypeItem,i: number){            
    this.LoadItems();    
    this.SelectedItem[i] = $event;    
    this.GridList[i].Item = $event;    
    //this.newGridEvent.emit(this.GridList);
  }
 
  
  getNewUom($event: TypeUom,i: number){          
    this.LoadUoms();    
    this.SelectedUom[i] = $event;    
    
    this.GridList[i].Uom = $event;   
    //this.newGridEvent.emit(this.GridList);
  }
 
  LoadStockRegisterList(){
    let itm = new ClsTransactions(this.dataService);    
    itm.getBatchStock(this.VouTypeSno).subscribe( data => {          
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.StockRegisterList = JSON.parse(data.apiData);                         
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  }

  OpenInventory(i: number){    
      const dialogRef = this.dialog.open(StockselectionComponent, 
        {
          data: this.StockRegisterList,
          width:"100%"
        });       

        dialogRef.disableClose = true; 
        dialogRef.afterClosed().subscribe(result => {                  
          if (result) 
          { 
            this.StockRegisterList = result;
            this.GridList = [];
            for (var i=0; i< result.length; i++){
              let emitItem: TypeGridItem;         
              if (result[i].Selected == 1)
                {
                  emitItem = {
                              "Item":{"ItemSno": result[i].ItemSno, "Item_Name": result[i].Item_Name, "Item_Code": result[i].Item_Code, "Name": result[i].Item_Name, "Details": "Code: " + result[i].Item_Name}, 
                              "Uom" : {"UomSno": result[i].UomSno, "Uom_Code":result[i].Uom_Code, "Uom_Name": result[i].Uom_Name, "Name" :result[i].Uom_Name, "Details": "Code: " + result[i].Uom_Code, 
                               "Base_Qty": result[i].Base_Qty }, "BatchSno" :result[i].BatchSno, "Batch_No" : result[i].Batch_No, "Qty":1, "PureWt": result[i].PureWt, "PureSilverWt":result[i].PureSilverWt,
                              "Karat" : result[i].Karat, "PurityPer" :result[i].PurityPer, "GrossWt":+result[i].BalGrossWt, "StoneWt":+result[i].BalStoneWt, "Wastage":+result[i].BalWastage, 
                              "NettWt":+result[i].BalNettWt, "SilverWt":0, "SilverPurity":0, "Rate" : +parseFloat(result[i].Rate).toFixed(2) , "Amount" : +parseFloat(result[i].Amount).toFixed(2), 
                              "Remarks" :result[i].Description, "BatchItems" :""
                            }             
                  this.GridList.push (emitItem);
                  if (this.SingleItem ) { break;}
                }
            }
            
            if (this.GridList)
              {    
                for (let i=0; i<this.GridList.length;i++)
                {
                  this.SelectedItem[i]=this.GridList[i].Item;
                  this.SelectedUom[i]=this.GridList[i].Uom;        
                }
              }       
              
              // this.SetTotals();
          }        
        });      
  }


  CalcPurity(item: TypeGridItem)
  {
    item.PurityPer = +((item.Karat / 24) * 100).toFixed(2) ;
  }

  CalcKarat(item: TypeGridItem)
  {
    item.Karat = Math.round((item.PurityPer / 100) *24);
  }

  FocusNext(){
    if (this.StockInput){
      this.batchno.nativeElement.focus();
    }
    else {
      this.qty.nativeElement.focus();
    }
  }

  FocusNextfromWt(){
    if (this.WastageCol){
      this.wastage.nativeElement.focus();
    }
    else
    {
      this.stonewt.nativeElement.focus();
    }
  }
}
