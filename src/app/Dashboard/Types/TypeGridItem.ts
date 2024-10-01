import { TypeItem } from "../Classes/ClsItems";
import { TypeUom } from "../Classes/ClsUoms";

export interface TypeGridItem{
    Item: TypeItem;    
    Uom: TypeUom;
    BatchSno: number;
    Batch_No: string;
    Qty: number;
    Karat: number;
    PurityPer: number;
    GrossWt: number;
    StoneWt: number;
    Wastage: number;
    NettWt: number;
    SilverWt: number;
    SilverPurity: number;
    PureWt: number;
    PureSilverWt: number;
    Rate: number;
    Amount: number;    
    Remarks: string;
    BatchItems: string;
}