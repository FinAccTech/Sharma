import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, of } from 'rxjs';
import { MsgboxComponent } from './GlobalWidgets/msgbox/msgbox.component';
import { SnackbarComponent } from './GlobalWidgets/snackbar/snackbar.component';
import { TypeCompanies } from './GlobalTypes/TypeCompany';
import { TypeGridItem } from './Dashboard/Types/TypeGridItem';
import { FileHandle } from './Dashboard/Types/file-handle';
import { TypeBatchBills } from './Dashboard/Types/TypeBatchBills';
import { TypeVoucher } from './Dashboard/Classes/ClsVouchers';
import { TypeTransactions } from './Dashboard/Classes/ClsTransactions';
import { IntToDatePipe } from './Dashboard/Pipes/int-to-date.pipe';
import { TypeItemGridTotals } from './Dashboard/Types/TypeItemGridTotals';


@Injectable({
  providedIn: 'root'
})

export class GlobalsService 
{
  constructor(private dialog: MatDialog){}
  
    baseApiURL:string     = "https://finaccsaas.com/Sharma/data/RestApi.php/app";

    AppName: string = "Sharma";
    AppLogoPath: string = "./assets/images/defaultlogo.jpeg";

    CompaniesList: TypeCompanies[] = []; //For Companies List Array

    //Party Types
    PartyTypCustomers:    number = 1;
    PartyTypSuppliers:    number = 2;
    PartyTypJobWorkers:   number = 3; 

  
    //Voucher Types    
    VTypOpeningStock:         number = 1;
    VTypBuyingContract:       number = 2;
    VTypBuyingReceipt:        number = 3;    
    VTypSmeltingIssue:        number = 4;
    VTypSmeltingReceipt:      number = 5;
    VTypRefiningIssue:        number = 6;
    VTypRefiningReceipt:      number = 7;
    VTypCastingIssue:         number = 8;
    VTypCastingReceipt:       number = 9;
    VTypSalesInvoice:         number = 10;
    VTypDeliveryDoc:          number = 11;
    VTypOpeningCash:          number = 12;
    VTypPayment:              number = 13;
    VTypReceipt:              number = 14;
    VTypBankPayment:          number = 15;
    VTypBankReceipt:          number = 16;
    VTypJobworkInward:        number = 17;
    VTypJobworkDelivery:      number = 18;
    VTypPurchaseOrder:        number = 19;
    VTypSalesOrder:           number = 20;

    //Voucher Series
    // VSerBuyingContract:   number = 1;
    // VSerBuyingReceipt:    number = 2;
    // VSerSalesInvoice:     number = 3;
    // VSerSmeltingIssue:    number = 4;
    // VSerSmeltingReceipt:  number = 5;
    // VSerRefininfIssue:    number = 6;
    // VSerRefininfReceipt:  number = 7;
    // VSerCastingIssue:     number = 8;
    // VSerCastingReceipt:   number = 9;

    //Dialog Types    
    DialogTypeProgress  = 0; 
    DialogTypeInfo      = 1;
    DialogTypeQuestion  = 2;
    DialogTypeError     = 3; 
    
    //Status Types
    StatusAll: number = 0;
    StatusFalse: number = 1;    
    StatusTrue: number  = 2;
    
    //Grid List
    GetGridList(): TypeGridItem[]{
      return [{ "Item": {"ItemSno":0, "Item_Code": '', "Item_Name": ''} , "BatchSno":0, "Batch_No": "", "Qty":0, "StoneWt": 0, "GrossWt": 0, "Wastage":0, "NettWt": 0, "SilverWt":0, "SilverPurity":0, "PureWt":0, "PureSilverWt":0, "Uom":{"UomSno":0, "Uom_Code": "", "Uom_Name": "" }, "Karat":0 , "PurityPer" :0,"Rate":0, "Amount": 0, "Remarks": "", "BatchItems" :"" }];        
    }
    
    GetGridTotal(): TypeItemGridTotals{
      return { "TotQty": 0, "TotGrossWt": 0, "TotStoneWt":0, "TotNettWt": 0, "TotSilverWt":0, "TotPureWt":0, "TotPureSilverWt":0, "TaxableValue":0,  "TotValue": 0 };        
    }

  DateToInt(inputDate: Date)
  {
    let month: string = (inputDate.getMonth() + 1).toString();    
    let day: string = inputDate.getDate().toString();    
    if (month.length == 1) { month = "0" + month }
    if (day.length == 1) {day = "0" + day }
    return parseInt (inputDate.getFullYear().toString() + month + day);
  }
  
  IntToDate(inputDate: any)
  {
    let argDate = inputDate.toString();
    let year = argDate.substring(0,4);
    let month = argDate.substring(4,6);
    let day = argDate.substring(6,9);
    let newDate = year + "/" + month + "/" + day;
    return new Date(newDate);
  }

  IntToDateString(inputDate: any)
  {
    let argDate = inputDate.toString();
    let year = argDate.substring(0,4);
    let month = argDate.substring(4,6);
    let day = argDate.substring(6,9);
    let newDate = day + "/" + month + "/" + year;
    return newDate;
  }

  ShowAlert(AlertType: number, Message: string ){
    // 1-Info, 2-Question, 3-Error
    const dialogRef = this.dialog.open(MsgboxComponent,
      {
        data: {"DialogType": AlertType, "Message": Message},   
      } 
      );  
      dialogRef.disableClose = true;
  }

  QuestionAlert(Message: string): Observable<number> {
    var subject = new Subject<number>();
    const dialogRef = this.dialog.open(MsgboxComponent,
      {
        data: {"DialogType": this.DialogTypeQuestion, "Message": Message},   
      } 
      );  
      dialogRef.disableClose = true;      

      dialogRef.afterClosed().subscribe(result => {        
          subject.next(result);
      });        
      return subject.asObservable();
  }

  SnackBar(Type: string, Msg: string, duration: number): void {
    const timeout = duration;
    const dialogRef = this.dialog.open(SnackbarComponent, {      
      minWidth:'350px',
      height: '60px',
      position: {top: '80px'} ,
      data: {"type":Type, "message": Msg},
      backdropClass: "none",   
      enterAnimationDuration: 500,
      exitAnimationDuration: timeout       
    });

    dialogRef.afterOpened().subscribe(_ => {
      setTimeout(() => {
         dialogRef.close();
      }, timeout)
    })
  }

GenerateItemXML(GridList: TypeGridItem[]): string {
  var StrItemXML: string = "";
    StrItemXML = "<ROOT>"
    StrItemXML += "<Transaction>"
    
    for (var i=0; i < GridList.length; i++)
    {
        StrItemXML += "<Transaction_Details ";
        StrItemXML += " ItemSno='" + GridList[i].Item.ItemSno + "' ";                 
        StrItemXML += " BatchSno='" + GridList[i].BatchSno + "' ";                 
        StrItemXML += " UomSno='" + GridList[i].Uom.UomSno + "' ";                 
        StrItemXML += " Karat='" + GridList[i].Karat + "' ";                 
        StrItemXML += " PurityPer='" + GridList[i].PurityPer + "' ";                 
        StrItemXML += " Qty='" + GridList[i].Qty + "' ";             
        StrItemXML += " GrossWt='" + GridList[i].GrossWt + "' ";             
        StrItemXML += " StoneWt='" + GridList[i].StoneWt + "' ";             
        StrItemXML += " Wastage='" + GridList[i].Wastage + "' ";             
        StrItemXML += " NettWt='" + GridList[i].NettWt + "' ";  
        StrItemXML += " SilverWt='" + GridList[i].SilverWt + "' "; 
        StrItemXML += " SilverPurity='" + GridList[i].SilverPurity + "' "; 
        StrItemXML += " PureWt='" + GridList[i].PureWt + "' "; 
        StrItemXML += " PureSilverWt='" + GridList[i].PureSilverWt + "' "; 
        StrItemXML += " Rate='" + GridList[i].Rate + "' ";             
        StrItemXML += " Amount='" + GridList[i].Amount + "' ";                     
        StrItemXML += " IteRemarks='" + GridList[i].Remarks + "' ";             
        StrItemXML += " >";
        StrItemXML += "</Transaction_Details>";    
    }     
    
    StrItemXML += "</Transaction>"
    StrItemXML += "</ROOT>";

    return StrItemXML;
}

GenerateImageXML(TransImages: FileHandle[]): string {
  var StrImageXml: string = "";
  
  StrImageXml = "<ROOT>"
  StrImageXml += "<Images>"
  
  for (var i=0; i < TransImages.length; i++)
  {
    if (TransImages[i].DelStatus == 0) 
    {
      StrImageXml += "<Image_Details ";
      StrImageXml += " Image_Name='" + TransImages[i].Image_Name + "' ";                 
      StrImageXml += " Image_Url='" + TransImages[i].Image_Name + "' ";             
      StrImageXml += " >";
      StrImageXml += "</Image_Details>";
    }      
  }   

  StrImageXml += "</Images>"
  StrImageXml += "</ROOT>";
  return StrImageXml;
}

GenerateBatchXML(BatchBills: TypeBatchBills[]): string {

  var StrBatchXml: string = "";
  
  StrBatchXml = "<ROOT>"
  StrBatchXml += "<Batch>"
  
  for (var i=0; i < BatchBills.length; i++)  {
    if (BatchBills[i].Selected == true)
      {
        StrBatchXml += "<Batch_Details ";
        StrBatchXml += " TransSno='" + BatchBills[i].TransSno + "' ";                     
        StrBatchXml += " >";
        StrBatchXml += "</Batch_Details>";    
      }    
  }   

  StrBatchXml += "</Batch>"
  StrBatchXml += "</ROOT>";
  return StrBatchXml;
}

GenerateVoucherXML(Voucher: TypeVoucher, CashLedSno: number): string {

  var StrVouXml: string = "";
  
  StrVouXml = "<ROOT>" ;
    StrVouXml += "<Voucher>"

      switch (Voucher.VouTypeSno) {
        case 13: //PAYMENT
          StrVouXml += "<Voucher_Details";
          StrVouXml += " LedSno='" + Voucher.Ledger?.LedSno + "' ";          
          StrVouXml += " Debit='0'";  
          StrVouXml += " Credit='" + (Voucher.Cash_Amount! +  Voucher.Bank_Amount!) + "' ";
          StrVouXml += ">";
          StrVouXml += "</Voucher_Details>";

          if (Voucher.Cash_Amount != 0)
            {
              StrVouXml += "<Voucher_Details";
              StrVouXml += " LedSno='" + CashLedSno + "' ";
              StrVouXml += " Debit='" + Voucher.Cash_Amount + "' ";  
              StrVouXml += " Credit='0'";               
              StrVouXml += ">" 
              StrVouXml += "</Voucher_Details>"     
            }
          
          if (Voucher.Bank_Amount !=0)
            {
              StrVouXml += "<Voucher_Details";
              StrVouXml += " LedSno='" + Voucher.Bank?.LedSno + "' ";
              StrVouXml += " Debit='" + Voucher.Bank_Amount + "' ";  
              StrVouXml += " Credit='0'";               
              StrVouXml += ">"; 
              StrVouXml += "</Voucher_Details>";
            }
          break;              

        case 14: //RECEIPT
          StrVouXml += "<Voucher_Details";
          StrVouXml += " LedSno='" + Voucher.Ledger?.LedSno + "' ";
          StrVouXml += " Debit='" + (Voucher.Cash_Amount! +  Voucher.Bank_Amount!) + "' ";
          StrVouXml += " Credit='0'";           
          StrVouXml += ">";
          StrVouXml += "</Voucher_Details>";

          if (Voucher.Cash_Amount != 0)
            {
              StrVouXml += "<Voucher_Details";
              StrVouXml += " LedSno='" + CashLedSno + "' ";
              StrVouXml += " Debit='0'" ;  
              StrVouXml += " Credit='" + Voucher.Cash_Amount + "' ";              
              StrVouXml += ">"; 
              StrVouXml += "</Voucher_Details>"     
            }
          
          if (Voucher.Bank_Amount !=0)
            {
              StrVouXml += "<Voucher_Details";
              StrVouXml += " LedSno='" + Voucher.Bank?.LedSno + "' ";
              StrVouXml += " Debit='0'";   
              StrVouXml += " Credit='" + Voucher.Bank_Amount + "' ";               
              StrVouXml += ">";
              StrVouXml += "</Voucher_Details>";
            }
          break;              

        case 15: //BANK PAYMENT
          StrVouXml += "<Voucher_Details";
          StrVouXml += " LedSno='" + CashLedSno + "' ";
          StrVouXml += " Debit='0' ";
          StrVouXml += " Credit='" + (Voucher.Cash_Amount! +  Voucher.Bank_Amount!) + "'";           
          StrVouXml += ">";
          StrVouXml += "</Voucher_Details>";

          
          StrVouXml += "<Voucher_Details";
          StrVouXml += " LedSno='" + Voucher.Bank?.LedSno + "' ";
          StrVouXml += " Debit='" + Voucher.Cash_Amount + "' ";  
          StrVouXml += " Credit='0'" ;                        
          StrVouXml += ">"; 
          StrVouXml += "</Voucher_Details>"     
          
          break;       

        case 16: //BANK RECEIPT
          StrVouXml += "<Voucher_Details";
          StrVouXml += " LedSno='" + CashLedSno + "' ";
          StrVouXml += " Debit='" + (Voucher.Cash_Amount! +  Voucher.Bank_Amount!) + "'";           
          StrVouXml += " Credit='0' ";          
          StrVouXml += ">";
          StrVouXml += "</Voucher_Details>";

          
          StrVouXml += "<Voucher_Details";
          StrVouXml += " LedSno='" + Voucher.Bank?.LedSno + "' ";
          StrVouXml += " Debit='0'" ;
          StrVouXml += " Credit='" + Voucher.Cash_Amount + "' ";              
                      
          StrVouXml += ">"; 
          StrVouXml += "</Voucher_Details>"     
          
          break;       
      }  
    
    StrVouXml += "</Voucher>" 
  StrVouXml += "</ROOT>"
  return StrVouXml;
}

PrintVoucher(Trans: TypeTransactions) {  
  
  let StrHtml ='';  
  StrHtml += '		<div class="header"> ';
  StrHtml += '			<div class="title"> ';
  StrHtml += '				'+ Trans.Series!.Series_Name.toUpperCase() +' ';
  StrHtml += '			</div> ';
  StrHtml += '			<div class="titleInfo"> ';
  StrHtml += '				<div class="titleLeft"> ';

  if (Trans.CompSno == 1)
    {
      StrHtml += '					<img src="https://finaccsaas.com/Sharma/assets/images/sharmanewlogo.jpeg" width="120" height="120" /> ';
    }
  else
  {
      StrHtml += '					<img src="https://finaccsaas.com/Sharma/assets/images/aussienewlogo.jpeg" width="350" height="120"/> ';
  }
  
  StrHtml += '				</div>				 ';
  StrHtml += '				<div class="titleRight"> ';
  StrHtml += '					<div class="address"> ';
  StrHtml += '						<div class="addressLine"> ';
  StrHtml += '<div class="iconSection"> ';
  // StrHtml += '								<i class="fa fa-map-marker" aria-hidden="true"></i> ';
  StrHtml += '</div> ';
  StrHtml += '<div class="textSection"> ';
  if (Trans.CompSno == 1)
    {
      StrHtml += '								<p><strong>Sharma Bullion Pty Ltd </strong> </p> ';
    }
  else{
    StrHtml += '								<p><strong>A.P.M.R Pty Ltd. </strong> </p> ';
  }
  
  StrHtml += '</div> ';
  StrHtml += '						</div> ';

  if (Trans.CompSno == 1)
    {
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      StrHtml += '								 ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';
      StrHtml += '								<p>Office no 808 level 8 </p> ';
      StrHtml += '</div> ';
      StrHtml += '						</div> ';
      StrHtml += '						 ';
      
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      StrHtml += '								 ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';
      StrHtml += '								<p>Century Building</p> ';
      StrHtml += '</div> ';
      StrHtml += '						</div> ';
      StrHtml += '						 ';
    
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      StrHtml += '								 ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';
      StrHtml += '								<p>125 Swanston St</p> ';
      StrHtml += '</div> ';
      StrHtml += '						</div> ';
      StrHtml += ' ';
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      // StrHtml += '								<i class="fa fa-envelope-o" aria-hidden="true"></i> ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';
      StrHtml += '								3000 Melbourne (Vic)  ';
      StrHtml += '</div> ';
      StrHtml += '						</div>						 ';
    
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      // StrHtml += '								<i class="fa fa-globe" aria-hidden="true"></i>	 ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';
      StrHtml += '								Tel: 0488 786 680 ';
      StrHtml += '</div> ';
      StrHtml += '						</div> ';
      StrHtml += '						 ';
      
      StrHtml += '						 ';
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      // StrHtml += '								<i class="fa fa-mobile" aria-hidden="true"></i> ';
      StrHtml += '</div> ';
      StrHtml += '							<div class="textSection"> ';
      StrHtml += '								www.goldbuyersharma.com.au ';
      StrHtml += '</div> ';
      StrHtml += '						</div>						 ';
    }
    else{
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      StrHtml += '								 ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';
      StrHtml += '								<p>60 New Street </p> ';
      StrHtml += '</div> ';
      StrHtml += '						</div> ';
      StrHtml += '						 ';
      
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      StrHtml += '								 ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';
      StrHtml += '								<p>South Kingsville. 3015 ( Victoria )</p> ';
      StrHtml += '</div> ';
      StrHtml += '						</div> ';
      StrHtml += '						 ';
    
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      StrHtml += '								 ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';
      
      StrHtml += '								Cell 0488 786 680 ';
      StrHtml += '</div> ';
      StrHtml += '						</div> ';
      StrHtml += ' ';
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      // StrHtml += '								<i class="fa fa-envelope-o" aria-hidden="true"></i> ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';
      
      StrHtml += '								Tel 03 90413187 ';
      StrHtml += '</div> ';
      StrHtml += '						</div>						 ';
    
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      // StrHtml += '								<i class="fa fa-globe" aria-hidden="true"></i>	 ';
      StrHtml += '</div> ';
      StrHtml += '<div class="textSection"> ';

      
      StrHtml += '								Apmr@arorabullion.com ';
      
      StrHtml += '</div> ';
      StrHtml += '						</div> ';
      StrHtml += '						 ';
      
      StrHtml += '						 ';
      StrHtml += '						<div class="addressLine"> ';
      StrHtml += '<div class="iconSection"> ';
      // StrHtml += '								<i class="fa fa-mobile" aria-hidden="true"></i> ';
      StrHtml += '</div> ';
      StrHtml += '							<div class="textSection"> ';
      StrHtml += '								www.Aussiemint.com ';
      StrHtml += '</div> ';
      StrHtml += '						</div>						 ';

    }
  

  StrHtml += '					</div> ';
  StrHtml += '				</div>		 ';		
  StrHtml += '			</div>			 ';
  StrHtml += '		</div> ';
  StrHtml += '		<br> ';
  StrHtml += '		<hr> ';

  StrHtml += '		<div class="docDetails"> ';
  StrHtml += '			<p>' + Trans.Series!.Series_Name + ' No: '+ Trans.Trans_No + '</p> ';  
  
  const filterPipe = new IntToDatePipe();
  
  StrHtml += '			<p>' +  Trans.Series!.Series_Name + ' Date: ' + filterPipe.transform(Trans.Trans_Date); + '</p> ';
  StrHtml += '		</div> ';

  if (Trans.RefSno !==0)
    {
      StrHtml += '		<div class="docDetails"> ';
      StrHtml += '			<p> Reference No: ' + Trans.Ref_No + '</p> ';      
      StrHtml += '		</div> ';
    }
  

  StrHtml += '		<div class="clientDetails"> ';
  StrHtml += '			<div class="detailsSection"> ';
  if (Trans.Party.Director_Name)
    {
      StrHtml += '				<div class="line"> <p class="caption">Name</p> <p class="value"> ' + Trans.Party.Party_Name + ' (Director Name: '+ Trans.Party.Director_Name + ')   </p> </div> ';
  }
  else{
    StrHtml += '				<div class="line"> <p class="caption">Name</p> <p class="value"> ' + Trans.Party.Party_Name + '   </p> </div> ';
  }
  
  StrHtml += '				<div class="line"> <p class="caption">Address</p> <p class="value"> ' + Trans.Party.Address + ' </p> </div> ';
  StrHtml += '				<div class="line"> <p class="caption">Suburb</p> <p class="value"> ' + Trans.Party.City + ' </p> </div> ';
  StrHtml += '				<div class="line"> <p class="caption">Postal Code</p> <p class="value"> ' + Trans.Party.Pincode + ' </p> </div> ';
  StrHtml += '				<div class="line"> <p class="caption">Phone</p> <p class="value"> ' + Trans.Party.Mobile + ' </p> </div> ';
  StrHtml += '				<div class="line"> <p class="caption">Email</p> <p class="value"> ' + Trans.Party.Email + ' </p> </div> ';
  if (Trans.Party.Gst_Number){
    StrHtml += '				<div class="line"> <p class="caption">Gst Number</p> <p class="value"> ' + Trans.Party.Gst_Number + ' </p> </div> ';
  }  
  StrHtml += '				<div class="line"> <p class="caption">Number</p> <p class="value"> ' + Trans.Party.Reference + ' </p> </div> ';
  if (Trans.Party.Issue_Date !==0){
    StrHtml += '				<div class="line"> <p class="caption">Date of Issue</p> <p class="value"> ' + filterPipe.transform(Trans.Party.Issue_Date!) + '</p> </div> ';
  }
  if (Trans.Party.Expiry_Date !==0){
    StrHtml += '				<div class="line"> <p class="caption">Expiry</p> <p class="value">  ' + filterPipe.transform (Trans.Party.Expiry_Date!) + ' </p> </div> ';
  }

  StrHtml += '			</div> ';  
  StrHtml += '		</div> ';

  StrHtml += '		<div class="remarkSection"> ';
  if (Trans.Print_Remarks){
    StrHtml += '<p>' + Trans.Print_Remarks + '</p>' ;  
  }
  StrHtml += '		</div> ';

  StrHtml += '		<div class="itemDetails"> ';
  StrHtml += '			<div class="row"> ';
  StrHtml += '				<div class="batCol btext"> Batch No</div> ';
  StrHtml += '				<div class="itemCol btext"> Item</div> ';
  StrHtml += '				<div class="ktCol btext"> K.T%</div> ';
  StrHtml += '				<div class="descCol btext"> Description</div> ';
  StrHtml += '				<div class="gwtCol btext"> Gross Wt</div> ';
  StrHtml += '				<div class="stCol btext"> Stone </div> ';
  StrHtml += '				<div class="nwtCol btext"> Nett Wt</div> ';

  if (Trans.VouTypeSno !== this.VTypDeliveryDoc){
    StrHtml += '				<div class="priceCol btext"> Price / Gm</div> ';
    StrHtml += '				<div class="totCol btext"> Total</div>	 ';
  }
  
  StrHtml += '			</div> ';
  
  const ItemsList = JSON.parse(Trans.Items_Json!);
  
  for (var i=0; i< ItemsList.length; i++)
    {
      StrHtml += '			<div class="row"> ';
      StrHtml += '				<div class="batCol"> '    + ItemsList[i].Batch_Caption + ' </div> ';
      StrHtml += '				<div class="itemCol"> '    + ItemsList[i].Item.Item_Name + ' </div> ';
      StrHtml += '				<div class="ktCol"> '     + ItemsList[i].PurityPer.toFixed(3) + '</div> ';
      StrHtml += '				<div class="descCol"> '   + ItemsList[i].Remarks + '</div> ';
      StrHtml += '				<div class="gwtCol"> '    + ItemsList[i].GrossWt.toFixed(3) + '</div> ';
      StrHtml += '				<div class="stCol"> '     + ItemsList[i].StoneWt.toFixed(3) + '</div> ';
      StrHtml += '				<div class="nwtCol"> '    + ItemsList[i].NettWt.toFixed(3) + '</div> ';
      if (Trans.VouTypeSno !== this.VTypDeliveryDoc){
        StrHtml += '				<div class="priceCol"> '  + ItemsList[i].Rate.toFixed(2) + '</div> ';
        StrHtml += '				<div class="totCol"> '    + ItemsList[i].Amount.toFixed(2) + '</div>	 ';
      }

      StrHtml += '			</div> ';
    }  
  
  StrHtml += '			<div class="gridTotal"> ';  
  
  StrHtml += '				<div class="valueGrp"> <p class="caption"> Gross Wt </p> <p class="value"> '  + Number(Trans.TotGrossWt).toFixed(3)  + ' </p> </div>  ';
  StrHtml += '				<div class="valueGrp"> <p class="caption"> Stone Wt </p> <p class="value"> '  + Number(Trans.TotStoneWt).toFixed(3)  + ' </p> </div>  ';
  StrHtml += '				<div class="valueGrp"> <p class="caption"> Nett Wt </p> <p class="value"> '  + Number(Trans.TotNettWt).toFixed(3)  + ' </p> </div>  ';
  if (Trans.VouTypeSno !== this.VTypDeliveryDoc && Trans.VouTypeSno !== this.VTypSmeltingIssue && Trans.VouTypeSno !== this.VTypSmeltingReceipt && Trans.VouTypeSno !== this.VTypRefiningIssue && Trans.VouTypeSno !== this.VTypRefiningReceipt && Trans.VouTypeSno !== this.VTypCastingIssue && Trans.VouTypeSno !== this.VTypCastingReceipt  ){
    StrHtml += '				<div class="valueGrp"> <p class="caption"> Gst </p> <p class="value"> '  + Number(Trans.TaxAmount).toFixed(2)  + ' </p> </div>  ';
    StrHtml += '				<div class="valueGrp"> <p class="caption"> Reverse Gst </p> <p class="value"> '  + Number(Trans.RevAmount).toFixed(2)  + ' </p> </div>  ';
    StrHtml += '				<div class="valueGrp"> <p class="caption"> Nett Amt </p> <p class="value"> '  + Number(Trans.NettAmt).toFixed(2)  + ' </p> </div>  ';
  }
  // StrHtml += '				<p> Stone Wt: ' + Number(Trans.TotStoneWt).toFixed(3)  + ' </p> ';
  // StrHtml += '				<p> Nett Wt: ' + Number(Trans.TotNettWt).toFixed(3)  + ' </p> ';
  // StrHtml += '				<p> Tax Amt: ' + Number(Trans.TaxAmount).toFixed(2)  + ' </p> ';
  // StrHtml += '				<p> Reverse Amt: ' + Number(Trans.RevAmount).toFixed(2)  + ' </p> ';    
  // StrHtml += '				<p> Total Amt ' +  Number(Trans.NettAmt).toFixed(2) + ' </p> ';    
  
  StrHtml += '			</div> ';

  StrHtml += '		</div> ';
  if (Trans.VouTypeSno !== this.VTypDeliveryDoc && Trans.VouTypeSno !== this.VTypSmeltingIssue && Trans.VouTypeSno !== this.VTypSmeltingReceipt && Trans.VouTypeSno !== this.VTypRefiningIssue && Trans.VouTypeSno !== this.VTypRefiningReceipt && Trans.VouTypeSno !== this.VTypCastingIssue && Trans.VouTypeSno !== this.VTypCastingReceipt  ){
    StrHtml += '		<div class="footer"> ';
    StrHtml += '			<div class="paymodes"> ';
    StrHtml += '      <p> Cash : ' +  Trans.Cash_Amount + '  </p>';
    StrHtml += '      <p> EFT : ' +  Trans.Bank_Amount + '  </p>';
    // StrHtml += '				<input type="checkbox" > &nbsp;&nbsp;<label>Cash ' + Trans.Cash_Amount + ' </label>  ';
    // StrHtml += '				<input type="checkbox" > &nbsp;&nbsp;<label>EFT ' + Trans.Bank_Amount  +  ' </label> &nbsp;&nbsp;&nbsp;&nbsp; ';
    StrHtml += '				<p>Bank Details: ' + Trans.Bank_Details + '</p> ';
    StrHtml += '			</div> ';
    StrHtml += '			<br> ';
  }

  if (Trans.VouTypeSno == this.VTypBuyingContract)
    {
      StrHtml += '			<div class="lineDesc"> ';
      StrHtml += '				<p class="sno" > (a) </p> ';
      StrHtml += '				<p class="desc"> You must fill out this form and sign it so that the dealer can be sure that you are the owner of the goods or that you have the authority of the owner to sell the goods  and </p>				 ';
      StrHtml += '			</div> ';
      StrHtml += '			<div class="lineDesc"> ';
      StrHtml += '				<p class="sno">(b)</p> ';
      StrHtml += '				<p class="desc">any information that you provide to the dealer may be passed onto the Commissioner of Police </p>				 ';
      StrHtml += '			</div> ';
      StrHtml += '			<p><strong>Warning:</strong>  It is a crime to give false information or make a false statement in this form </p> ';
      StrHtml += '			<br> ';
    }

    StrHtml += '			<div class="signs"> ';
    StrHtml += '				<p> Sign:___________________ </p> ';
    StrHtml += '				<p> Date:___________________ </p> ';
    StrHtml += '			</div>			 ';
        

    if (Trans.VouTypeSno == this.VTypBuyingReceipt)
      {
        if (Trans.CompSno == 2)
          {
            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 1. </p> ';
            StrHtml += '				<p class="desc">  Arora Precious Metals Refinery (“the Recipient”) is eligible to issue a RCTI in respect to suppliers.</p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 2. </p> ';
            StrHtml += '				<p class="desc">  The supplier will not issue tax invoices to Arora Precious Metals Refinery in respect of supplies.</p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 3. </p> ';
            StrHtml += '				<p class="desc">  Arora Precious Metals Refinery acknowledges that it is registered for GST and will notify the supplier is it ceases to be so. </p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 4. </p> ';
            StrHtml += '				<p class="desc">  The supplier acknowledges that it is registered for GST and will notify Arora Precious Metals Refinery if it ceases to satisfy any of the requirements of the Australian Tax Office Ruling GSTR 2000/10.</p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 5. </p> ';
            StrHtml += '				<p class="desc">  Arora Precious Metals Refinery indemnifies the supplier for any liability for GST and/or penalty that may arise from an understatement of the GST payable on any supply, to which Arora Precious Metals Refinery issues a RCTI.</p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 6. </p> ';
            StrHtml += '				<p class="desc">   Arora Precious Metals Refinery will issue any GST, RCTI as per the Australian Tax Office (ATO) under the Reverse Charge Ruling as at April of 2017.</p>';
            StrHtml += '			</div> ';
            
            StrHtml += '			<div class="signs" style="margin-top:.5rem" > ';
            StrHtml += '				<p> The Recipient</p> ';
            StrHtml += '				<p> Arora Precious Metals Refinery (ABN  5662 6465 816) </p> ';
            StrHtml += '			</div>			 ';
          }
        else 
          {
            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 1. </p> ';
            StrHtml += '				<p class="desc">  Sharma Bullion ("the Recipient”) is eligible to issue a RCTI in respect to suppliers.</p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 2. </p> ';
            StrHtml += '				<p class="desc">  The supplier will not issue tax invoices to Sharma Bullion in respect of supplies.</p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 3. </p> ';
            StrHtml += '				<p class="desc">  Sharma Bullion acknowledges that it is registered for GST and will notify the supplier is it ceases to be so. </p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 4. </p> ';
            StrHtml += '				<p class="desc">  The supplier acknowledges that it is registered for GST and will notify Sharma Bullion if it ceases to satisfy any of the requirements of the Australian Tax Office Ruling GSTR 2000/10.</p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 5. </p> ';
            StrHtml += '				<p class="desc">  Sharma Bullion indemnifies the supplier for any liability for GST and/or penalty that may arise from an understatement of the GST payable on any supply, to which Sharma Bullion issues a RCTI.</p>';
            StrHtml += '			</div> ';

            StrHtml += '			<div class="lineDesc smallline"> ';
            StrHtml += '				<p class="sno" > 6. </p> ';
            StrHtml += '				<p class="desc">   Sharma Bullion will issue any GST, RCTI as per the Australian Tax Office (ATO) under the Reverse Charge Ruling as at April of 2017.</p>';
            StrHtml += '			</div> ';
            
            StrHtml += '			<div class="signs" style="margin-top:.5rem" > ';
            StrHtml += '				<p>The Recipient</p> ';
            StrHtml += '				<p>Sharma Bullion Pty Ltd</p> ';
            StrHtml += '			</div>			 ';
          }
      }

  StrHtml += '		</div> ';  
  
  //return StrHtml;

  let popupWin;
    
    popupWin = window.open();
    popupWin!.document.open();
    popupWin!.document.write(`
          <html>
            <head>
              <link rel="stylesheet" type="text/css" href="https://finaccsaas.com/Sharma/assets/printstyle.css">
              <script src="https://kit.fontawesome.com/4a299f63d2.js" crossorigin="anonymous"></script> 
            </head>
            <body onload="window.print();window.close()">${StrHtml}</body>
          </html>`
    );
    popupWin!.document.close();

}

  /* ------------------------------------------For Opening Dialog with Animation----------------------------------------------------
    OpenDialog(enterAnimationDuration: string, exitAnimationDuration: string, DialogType: number, DialogText: string): void {
    this.globals.OpenDialog('500ms', '500ms',3,""); 
  ----------------------------------------------------------------------------------------------------------------------------------*/
  

}
