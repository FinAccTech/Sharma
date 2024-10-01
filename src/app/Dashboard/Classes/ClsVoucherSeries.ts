import { Observable} from "rxjs";
import { DataService } from "../Services/dataservice";
import { TypeHttpResponse } from "../Types/TypeHttpResponse";

export class ClsVoucherSeries{
    public Series!: TypeVoucherSeries;
    private CompSno: number;
    
    constructor(private dataService: DataService){
        this.CompSno = +sessionStorage.getItem("selectedcompsno")!;
    	}

    getSeriess(SeriesSno: number, VouTypeSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "SeriesSno" :  SeriesSno, "VouTypeSno": VouTypeSno, "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getSeries");                
    } 

    saveSeries(): Observable<TypeHttpResponse> {        
        let postdata = this.Series;
        return this.dataService.HttpPost(postdata, "/saveSeries");                
    }

    deleteSeries(): Observable<TypeHttpResponse> {
        let postdata ={ "SeriesSno" :  this.Series.SeriesSno, "CompSno" :  this.CompSno, }; 
        return this.dataService.HttpPost(postdata, "/deleteSeries");                
    }

    Initialize(){
        let Series: TypeVoucherSeries = {
            SeriesSno: 0,
            VouTypeSno: 0,
            Series_Name: "",
            Num_Method: 0,
            Allow_Duplicate: 0,
            Start_No: 0,
            Current_No: 0,
            Prefix: "",
            Suffix: "",
            Width: 0,
            Prefill: "",
            Print_Voucher: 0,
            Print_On_Save: 0,
            Show_Preview: 0,
            Print_Style: "",
            IsDefault: 0,
            Active_Status: 0,
            Create_Date: 0,
            CompSno: 0,
        }
        return Series
    }
}

export interface TypeVoucherSeries {
    SeriesSno: number;
    VouTypeSno: number;
    Series_Name: string;
    Num_Method?: number;
    Allow_Duplicate?: number;
    Start_No?: number;
    Current_No?: number;
    Prefix?: string;
    Suffix?: string;
    Width?: number;
    Prefill?: string;
    Print_Voucher?: number;
    Print_On_Save?: number;
    Show_Preview?: number;
    Print_Style?: string;
    IsDefault?: number;
    Active_Status?: number;
    Create_Date?: number;
    CompSno?: number;
    Name?:string;
    Details?:string;   

}
