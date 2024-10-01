import { Observable } from "rxjs";
import { DataService } from "../Services/dataservice";
import { TypeHttpResponse } from "../Types/TypeHttpResponse";
import { TypeUom } from "./ClsUoms";

export class ClsItem{
    public Item!: TypeItem;
    private CompSno!: string;
    
    constructor(private dataService: DataService){
        this.CompSno = sessionStorage.getItem("selectedcompsno")!;
    	}

    getItems(ItemSno: number): Observable<TypeHttpResponse> {
        let postdata ={  "ItemSno" :  ItemSno, "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getItems");                
    }

    saveItem(): Observable<TypeHttpResponse> {        
        let postdata =  this.Item;        
        return this.dataService.HttpPost(postdata, "/saveItem");                        
    }

    deleteItem(): Observable<TypeHttpResponse> {
        let postdata ={ "CompSno" :  this.CompSno, "ItemSno" :  this.Item.ItemSno, "Item_Code" :  this.Item.Item_Code }; 
        return this.dataService.HttpPost(postdata, "/deleteItem");                
    }

    
    Initialize(){
        let Item: TypeItem = {
            ItemSno:0,
            Item_Code: "AUTO",
            Item_Name: "",
            Remarks: "",
            Name: "",
            Details: "",
            Qty: 0,
            Uom: {"UomSno":0, "Uom_Code":"", "Uom_Name":""},
            Karat: 0,
            PurityPer: 0,
            Gross_Wt: 0,
            Stone_Wt: 0,
            Nett_Wt: 0,
            Amount: 0,
            CompSno: parseInt (sessionStorage.getItem("selectedcompsno")!),        
         }
        return Item
    }
}

export interface TypeItem{
    ItemSno: number;
    Item_Code: string;
    Item_Name: string;        
    Remarks?: string;
    Name?: string;
    Details?: string;
    Qty?: number;
    Uom?: TypeUom;
    Karat?: number;
    PurityPer?: number;
    Gross_Wt?: number;
    Stone_Wt?: number;
    Nett_Wt?: number;
    Amount?: number;
    CompSno?: number;
}

