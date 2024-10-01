import { Observable} from "rxjs";
import { DataService } from "../Services/dataservice";
import { TypeHttpResponse } from "../Types/TypeHttpResponse";

export class ClsUom{
    public Uom!: TypeUom;
    private CompSno: number;
    
    constructor(private dataService: DataService){
        this.CompSno = +sessionStorage.getItem("selectedcompsno")!;
    	}

    getUoms(UomSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "UomSno" :  UomSno, "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getUoms");                
    } 

    saveUom(): Observable<TypeHttpResponse> {
        let postdata = { "CompSno" :  this.CompSno, 
        "UomSno" : this.Uom.UomSno, 
        "Uom_Code" : this.Uom.Uom_Code, 
        "Uom_Name" : this.Uom.Uom_Name, 
        "Remarks" : this.Uom.Remarks, 
        "Active_Status" : this.Uom.Active_Status,
        "BaseUom": this.Uom.BaseUom?.UomSno,
        "BaseQty" : this.Uom.Base_Qty
        }

        return this.dataService.HttpPost(postdata, "/saveUom");                
    }

    deleteUom(): Observable<TypeHttpResponse> {
        let postdata ={ "UomSno" :  this.Uom.UomSno, "CompSno" :  this.CompSno, }; 
        return this.dataService.HttpPost(postdata, "/deleteUom");                
    }

    Initialize(){
        let Uom: TypeUom = {
            UomSno:0,
            Uom_Code: "AUTO",
            Uom_Name: "",           
            Remarks: "", 
            Active_Status: 1,            
            BaseUom: {"UomSno" :0, "Uom_Name": ""},
            BaseUom_Name: "",
            Base_Qty: 0,
        }
        return Uom
    }
}

export interface TypeUom {
    UomSno: number;
    Uom_Code?: string;
    Uom_Name?: string;    
    Active_Status?: number;   
    Remarks?: string, 
    BaseUom?: TypeUom,
    BaseUom_Name?: string,
    Base_Qty?: number,
    Name?:string;
    Details?:string;   

}
