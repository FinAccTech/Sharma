import { TypeLedger } from "../Classes/ClsLedgers";
import { TypeTransactions } from "../Classes/ClsTransactions"
import { TypeVoucherSeries } from "../Classes/ClsVoucherSeries";

export interface TypeDocHeader{
    TransSno: number;
    VouTypeSno: number;
    Series: TypeVoucherSeries;
    Trans_No: string;
    Trans_Date: number
    Due_Date: number;
    Reference: TypeTransactions;    
    Cash_Amount: number;
    Bank_Amount: number;
    Bank: TypeLedger;
    Bank_Details: string;
}