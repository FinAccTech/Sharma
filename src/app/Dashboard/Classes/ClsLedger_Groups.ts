import { Observable} from "rxjs";
import { DataService } from "../Services/dataservice";
import { TypeHttpResponse } from "../Types/TypeHttpResponse";

export class ClsLGrp{
    public LGrp!: TypeLGrp;
    private CompSno: number;
    
    constructor(private dataService: DataService){
        this.CompSno = +sessionStorage.getItem("selectedcompsno")!;
    	}

    getLGrps(GrpSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "GrpSno" :  GrpSno, "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getLedger_Groups");                
    } 

    saveLGrp(): Observable<TypeHttpResponse> {
        let postdata = this.LGrp;
        return this.dataService.HttpPost(postdata, "/saveLedger_Group");                
    }

    deleteLGrp(): Observable<TypeHttpResponse> {
        let postdata ={ "GrpSno" :  this.LGrp.GrpSno, "CompSno" :  this.CompSno, }; 
        return this.dataService.HttpPost(postdata, "/deleteLedger_Group");                
    }

    Initialize(){
        let Lgrp: TypeLGrp = {
            GrpSno:0,
            Grp_Name: "",            
            Remarks: "", 
            IsStd: 0,            
            CompSno: parseInt (sessionStorage.getItem("selectedcompsno")!), 
            UserSno: parseInt (sessionStorage.getItem("selectedusersno")!),        
            Name: "",
            Details: ""
        }
        return Lgrp
    }
}

export interface TypeLGrp {
    GrpSno: number;    
    Grp_Name?: string;        
    Remarks?: string;
    IsStd?: number; 
    CompSno?: number;
    UserSno?: number;    
    Name?:string;
    Details?:string; 
}
