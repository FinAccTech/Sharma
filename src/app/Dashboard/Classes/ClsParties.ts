import { Observable} from "rxjs";
import { DataService } from "../Services/dataservice";
import { TypeHttpResponse } from "../Types/TypeHttpResponse";
import { FileHandle } from "../Types/file-handle";


export class ClsParties{
    public Party!: TypeParties;
    private CompSno!: string;
    
    constructor(private dataService: DataService){
        this.CompSno = sessionStorage.getItem("selectedcompsno")!;
    	}

    getParties(PartySno: number, Party_Cat: number): Observable<TypeHttpResponse> {
        let postdata ={ "PartySno" :  PartySno, "Party_Cat": Party_Cat, "CompSno" :  this.CompSno }; 
        return this.dataService.HttpGet(postdata, "/getParties");                
    }

    saveParty(): Observable<TypeHttpResponse> {        
        let postdata = this.Party;
        return this.dataService.HttpPost(postdata, "/saveParty");                        
    }

    deleteParty(): Observable<TypeHttpResponse> {
        let postdata ={ "PartySno" :  this.Party.PartySno, "Party_Code" :  this.Party.Party_Code }; 
        return this.dataService.HttpPost(postdata, "/deleteParty");                
    }

    getPartyImages(PartySno: number): Observable<TypeHttpResponse> {
        let postdata ={"CompSno" :  this.CompSno,  "PartySno" :  PartySno}; 
        return this.dataService.HttpGet(postdata, "/getPartyImages");                
    }

    Initialize(){
        let Party: TypeParties = {
            PartySno:0,
            Party_Code: "AUTO",
            Party_Name: "",                        
            Party_Cat: 0,      
            Party_Type:0,                                        
            Address: "",            
            City: "",
            State: "",
            Pincode: "",             
            Mobile: "",
            Email: "",
            Reference: "",            
            Sex: 1,        
            Dob: DateToInt(new Date()),    
            Remarks: "",      
            Active_Status:1,
            Reg_Number: "",      
            Gst_Number: "",               
            Director_Name: "",      
            Create_Date: DateToInt(new Date()),                        
            CompSno: parseInt (sessionStorage.getItem("selectedcompsno")!), 
            UserSno: parseInt (sessionStorage.getItem("selectedusersno")!),            
            Issue_Date: DateToInt(new Date()),
            Expiry_Date: DateToInt(new Date()),
            ImageDetailXML: "",
            ProfileImage:"",
            fileSource: [],
            Name: "",
            Details:""
        }
        return Party
    }
}

export interface TypeParties{
    PartySno: number;
    Party_Code: string;
    Party_Name: string;    
    Party_Cat?: number;    
    Party_Type?: number;    
    Address?: string;
    RelName?: string;
    Mobile?: string;
    City?: string;
    State?: string;
    Pincode?: string;
    Sex?: number;    
    Dob?: number;
    Reference?: string;        
    Create_Date?: number;  
    Email?: string;
    Remarks?: string;     
    Active_Status?: number;
    Reg_Number?: string;
    Gst_Number?: string;               
    Director_Name?: string;     
    CompSno?: number;    
    UserSno?: number;    
    Issue_Date?: number;
    Expiry_Date?: number;
    ImageDetailXML?: string;
    ProfileImage?:string;
    TempImage?:File;
    fileSource?: FileHandle[];
    Name?: string;
    Details?: string;
}

function DateToInt(inputDate: Date)
  {
    let month: string = (inputDate.getMonth() + 1).toString();    
    let day: string = inputDate.getDate().toString();    
    if (month.length == 1) { month = "0" + month }
    if (day.length == 1) {day = "0" + day }
    return parseInt (inputDate.getFullYear().toString() + month + day);
  }
