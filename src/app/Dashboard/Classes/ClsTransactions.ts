import { Observable} from "rxjs";
import { DataService } from "../Services/dataservice";
import { TypeHttpResponse } from "../Types/TypeHttpResponse";
import { FileHandle } from "../Types/file-handle";
import { TypeParties } from "./ClsParties";
import { TypeVoucherSeries } from "./ClsVoucherSeries";
import { TypeBatchBills } from "../Types/TypeBatchBills";

export class ClsTransactions{
    public Trans!: TypeTransactions;
    private CompSno!: number;
    private UserSno!: number;
  
    constructor(private dataService: DataService){
        this.CompSno = +sessionStorage.getItem("selectedcompsno")!;
        this.UserSno = +sessionStorage.getItem("selectedusersno")!;
    	}

    getTransactions(TransSno: number, VouTypeSno: number, SeriesSno: number, FromDate: number, ToDate: number): Observable<TypeHttpResponse> {
        let postdata ={ "TransSno" :  TransSno, "VouTypeSno": VouTypeSno,"SeriesSno": SeriesSno, "FromDate": FromDate, "ToDate": ToDate, "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getTransactions");                
    }

    getTransactionDetails(TransSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "TransSno" :  TransSno, "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getTransactionDetails");                
    }

    saveTransaction(): Observable<TypeHttpResponse> {                
        let postdata = this.Trans;        
        return this.dataService.HttpPost(postdata, "/saveTransaction");                        
    }

    deleteTransaction(): Observable<TypeHttpResponse> {
        let postdata ={ "TransSno" :  this.Trans.TransSno, "Trans_No" :  this.Trans.Trans_No }; 
        return this.dataService.HttpPost(postdata, "/deleteTransaction");                
    }

    UpdateLockStatus(TransSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "TransSno" :  TransSno }; 
        return this.dataService.HttpPost(postdata, "/UpdateLockStatus");                
    }

    getLockStatus(TransSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "TransSno" :  TransSno}; 
        return this.dataService.HttpPost(postdata, "/getLockStatus");                
    }

    getVoucherNumber(SeriesSno: number): Observable<TypeHttpResponse> {
        let postdata ={"SeriesSno" :  SeriesSno}; 
        return this.dataService.HttpGet(postdata, "/getVoucherNumber");                
    }

    getTransactionImages(TransSno: number): Observable<TypeHttpResponse> {
        let postdata ={"CompSno" :  this.CompSno,  "TransSno" :  TransSno}; 
        return this.dataService.HttpGet(postdata, "/getTransactionImages");                
    }

    getPendingSmeltings(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getPendingSmeltings");                
    }

    getPendingRefinings(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getPendingRefinings");                
    }
    
    getPendingCastings(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getPendingCastings");                
    }

    getItemDetailsFromBills(Bills: TypeBatchBills[]): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno, "Bills": JSON.stringify (Bills) }; 
        return this.dataService.HttpGet(postdata, "/getItemDetailsFromBills");                
    }
    
    getPendingSmeltingIssues(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        return this.dataService.HttpGet(postdata, "/getPendingSmeltingIssues");                
    }

    getPendingRefiningIssues(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        return this.dataService.HttpGet(postdata, "/getPendingRefiningIssues");                
    }

    getPendingCastingIssues(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        return this.dataService.HttpGet(postdata, "/getPendingCastingIssues");                
    }

    getPendingDeliveryDocs(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        return this.dataService.HttpGet(postdata, "/getPendingDeliveryDocs");                
    }
    
    getPendingJobworkInwards(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        return this.dataService.HttpGet(postdata, "/getPendingJobworkInwards");                
    }

    getStockReport(GrpSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno, "GrpSno": GrpSno}; 
        return this.dataService.HttpGet(postdata, "/getStockReport");                
    }

    getStockRegister(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        return this.dataService.HttpGet(postdata, "/getStockRegister");                
    }

    getBatchStock(VouTypeSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno, "VouTypeSno" :  VouTypeSno}; 
        return this.dataService.HttpGet(postdata, "/getBatchStock");                
    }

    getBatchList(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        return this.dataService.HttpGet(postdata, "/getBatchList");                
    }

    getPendingPurchaseOrders(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        return this.dataService.HttpGet(postdata, "/getPendingPurchaseOrders");                
    }
        
    getPendingSalesOrders(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        return this.dataService.HttpGet(postdata, "/getPendingSalesOrders");                
    }
    getBatchHistory(BatchSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "BatchSno" :  BatchSno}; 
        return this.dataService.HttpGet(postdata, "/getBatchHistory");                
    }

    getPendingReport(Type: number): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno}; 
        let repName = "";
        switch (Type) {
            case 1:
                repName = "/getPendingSmeltingIssues";                
            break;
            case 2: 
                repName = "/getPendingRefiningIssues";                
                break;
            case 3:
                repName= "/getPendingCastingIssues";   
                break;            
            case 4:
                repName= "/getPendingDeliveryDocs";   
                break;            
        }
        return this.dataService.HttpGet(postdata, repName);   
    }

    Initialize(){
        let Trans: TypeTransactions = {
            TransSno:0,
            Trans_Date: 0,
            VouTypeSno: 0,
            Series:{"SeriesSno":0, "VouTypeSno":0, "Series_Name":""},
            Trans_No: "",    
            Due_Date:0,                    
            Party: {PartySno:0, Party_Code:"", Party_Name: ""},                                              
            RefSno: 0,            
            Cash_Amount: 0,
            Bank_Amount: 0,
            BankLedSno: 0,
            Bank_Details: "",
            Batch_Bills: "",
            TotQty:0,
            TotGrossWt: 0,
            TotStoneWt:0,
            TotNettWt:0,
            TotSilverWt:0,
            TotPureWt:0,
            TotPureSilverWt:0,
            TotPurity: 0,
            TotAmount:0,
            TaxPer:10,
            TaxAmount:0,
            RevAmount:0,
            NettAmt:0,            
            Remarks: "",    
            Print_Remarks: "",        
            Doc_Status:0,
            CompSno: parseInt (sessionStorage.getItem("selectedcompsno")!), 
            UserSno: parseInt (sessionStorage.getItem("selectedusersno")!),             
            ItemDetailXML: "",    
            ImageDetailXML: "",        
            BatchDetailXML: "",        
            fileSource: [],
            Name: "",
            Details:"",      
            Selected:0,             
        }
        return Trans
    }
}

export interface TypeTransactions{
    TransSno: number;
    Trans_Date: number;
    VouTypeSno: number;
    Series?: TypeVoucherSeries;
    Trans_No?: string;
    Due_Date?: number;
    Party: TypeParties;
    RefSno?: number;
    Cash_Amount?: number;
    Bank_Amount?: number;
    BankLedSno?: number;
    Bank_Details?: string;
    Batch_Bills?: string;
    TotQty?: number;
    TotGrossWt?: number;
    TotStoneWt?: number;
    TotNettWt?: number;
    TotSilverWt?: number;
    TotPureWt?: number;
    TotPureSilverWt?: number;
    TotPurity?: number;
    TotAmount?: number;
    TaxPer?: number;
    TaxAmount?: number;
    RevAmount?: number;
    NettAmt?: number;    
    Remarks?: string;    
    Print_Remarks?: string;    
    Doc_Status?: number;
    CompSno?: number;    
    UserSno?: number;    
    ItemDetailXML?: string;    
    ImageDetailXML?: string;    
    BatchDetailXML?: string;   
    fileSource?: FileHandle[];
    Name?: string;
    Details?: string;
    Series_Json?: string;
    Party_Json?: string;
    Items_Json?: string;
    Images_Json?: string;    
    Ref_Json?: string;
    Bank_Json?: string;
    Selected?: number;
    Ref_No?: string;
}
