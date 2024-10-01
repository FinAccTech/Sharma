import { Observable} from "rxjs";
import { DataService } from "../Services/dataservice";
import { TypeHttpResponse } from "../Types/TypeHttpResponse";
import { TypeLGrp } from "./ClsLedger_Groups";

export class ClsLedger{
    public Ledger!: TypeLedger;
    private CompSno: number;
    
    constructor(private dataService: DataService){
        this.CompSno = +sessionStorage.getItem("selectedcompsno")!;
    	}

    getLedgers(LedSno: number, GrpSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "LedSno" :  LedSno, "GrpSno" :  GrpSno, "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getLedgers");                
    } 

    saveLedger(): Observable<TypeHttpResponse> {
        let postdata = this.Ledger;
        return this.dataService.HttpPost(postdata, "/saveLedger");                
    }

    deleteLedger(): Observable<TypeHttpResponse> {
        let postdata ={ "LedSno" :  this.Ledger.LedSno, "CompSno" :  this.CompSno, }; 
        return this.dataService.HttpPost(postdata, "/deleteLedger");                
    }
    
    getBankAccounts(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getBankAccounts");                
    } 

    getCashAccount(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getCashAccount");                
    } 

    Initialize(){
        let Ledger: TypeLedger = {
            LedSno:0,            
            Led_Name: "",           
            Grp: {"GrpSno":0, "Grp_Name":""}, 
            IsStd:0,
            Open_Balance:0,
            Remarks: "",
            CompSno: parseInt (sessionStorage.getItem("selectedcompsno")!), 
            UserSno: parseInt (sessionStorage.getItem("selectedusersno")!), 
            Name: "",
            Details: ""
        }
        return Ledger
    }
}

export interface TypeLedger {
    LedSno: number;    
    Led_Name?: string;    
    Grp?: TypeLGrp;
    IsStd?: number;
    Open_Balance?: number;
    Remarks?: string;
    CompSno?: number;
    UserSno?: number;
    Name?:string;
    Details?:string;   

}
