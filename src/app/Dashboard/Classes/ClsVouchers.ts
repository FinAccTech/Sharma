import { Observable} from "rxjs";
import { DataService } from "../Services/dataservice";
import { TypeHttpResponse } from "../Types/TypeHttpResponse";
import { TypeVoucherSeries } from "./ClsVoucherSeries";
import { TypeLedger } from "./ClsLedgers";

export class ClsVoucher{

    public Voucher!: TypeVoucher;
    private CompSno: number;
    
    constructor(private dataService: DataService)
    {
        this.CompSno = +sessionStorage.getItem("selectedcompsno")!;
    }

    getVouchers(VouSno: number, VouTypeSno: number, SeriesSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "VouSno" :  VouSno, "VouTypeSno" : VouTypeSno, "SeriesSno": SeriesSno,  "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getVouchers");                
    } 

    saveVoucher(): Observable<TypeHttpResponse> {
        let postdata = this.Voucher;        
        return this.dataService.HttpPost(postdata, "/saveVoucher");                
    }

    deleteVoucher(): Observable<TypeHttpResponse> {
        let postdata ={ "VouSno" :  this.Voucher.VouSno, "CompSno" :  this.CompSno, }; 
        return this.dataService.HttpPost(postdata, "/deleteVoucher");                
    }

    getCashRegister(CashLedSno:number, VouDate: number): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno, "CashLedSno" :  CashLedSno, "VouDate": VouDate}; 
        return this.dataService.HttpGet(postdata, "/getCashRegister");                
    }

    Initialize(){
        let Voucher: TypeVoucher = {
            VouSno:0,
            Vou_No: "AUTO",
            VouTypeSno: 0,           
            Series: { "VouTypeSno":0, "SeriesSno":0, "Series_Name":""}, 
            VouDate:  DateToInt(new Date()),                        
            Remarks: "",
            Ledger: {"LedSno":0, "Led_Name":""},
            Cash_Amount: 0,
            Bank_Amount: 0,
            Bank: {"LedSno":0, "Led_Name":""},
            BankDetails: "",
            CompSno: parseInt (sessionStorage.getItem("selectedcompsno")!), 
            UserSno: parseInt (sessionStorage.getItem("selectedusersno")!),      
            VouDetailXML: ""
        }
        return Voucher
    }
}

export interface TypeVoucher {
    VouSno: number;
    Vou_No?: string;
    VouTypeSno?: number;
    Series?: TypeVoucherSeries;
    VouDate?: number;
    Remarks?: string;
    Ledger?: TypeLedger;
    Cash_Amount?: number;
    Bank_Amount?: number;
    Bank?: TypeLedger;
    BankDetails?: string;
    CompSno?: number;
    UserSno?: number;
    VouDetailXML?: string;
    Name?:string;
    Details?:string;   

}

function DateToInt(inputDate: Date)
  {
    let month: string = (inputDate.getMonth() + 1).toString();    
    let day: string = inputDate.getDate().toString();    
    if (month.length == 1) { month = "0" + month }
    if (day.length == 1) {day = "0" + day }
    return parseInt (inputDate.getFullYear().toString() + month + day);
  }