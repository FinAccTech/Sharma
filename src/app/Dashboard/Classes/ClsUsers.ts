import { Observable} from "rxjs";
import { DataService } from "../Services/dataservice";
import { TypeHttpResponse } from "../Types/TypeHttpResponse";

export class ClsUser{
    public User!: TypeUser;
    
    constructor(private dataService: DataService){}

    getUsers(UserSno: number): Observable<TypeHttpResponse> {
        let postdata ={ "UserSno" :  UserSno }; 
        return this.dataService.HttpGet(postdata, "/getUsers");                
    } 

    saveUser(): Observable<TypeHttpResponse> {
        let postdata = this.User;
        return this.dataService.HttpPost(postdata, "/saveUser");                
    }

    deleteUser(): Observable<TypeHttpResponse> {
        let postdata ={ "UserSno" :  this.User.UserSno }; 
        return this.dataService.HttpPost(postdata, "/deleteUser");                
    }

    Initialize(){
        let User: TypeUser = {
            UserSno:0,
            UserName: "",
            Password: "",           
            User_Type:0,            
            Active_Status: 1,
            Comp1Right: 0,
            Comp2Right: 0,
        }
        return User
    }
}

export interface TypeUser {
    UserSno: number;    
    UserName?: string;        
    Password?: string, 
    User_Type?: number;
    Active_Status?: number;
    Comp1Right?: number;
    Comp2Right?: number;
}
