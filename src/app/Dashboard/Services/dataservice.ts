import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { GlobalsService } from 'src/app/globals.service';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private globals: GlobalsService, private http: HttpClient) { }

   
  HttpPost(PostData: any, ApiSuffix: string)
  {      
      let postdata: string =JSON.stringify(PostData); 
    
      let params = new HttpParams()
      .set('data', postdata)      
        
      let apiURL: string = this.globals.baseApiURL + ApiSuffix;
    
      let header = new HttpHeaders();
      header.set('Access-Control-Allow-Origin', '*');
      
      return this.http.post<any>(apiURL, params );  
  }

  HttpGet(PostData: any, ApiSuffix: string)
  { 
    let postdata: string =JSON.stringify(PostData); 
    
    let params = new HttpParams()
    .set('data', postdata)    
        
    let apiURL: string = this.globals.baseApiURL + ApiSuffix;
    
    return this.http.get<any>(apiURL, { params })
        .pipe(map(datarecd => {                      
            return ( datarecd);                        
        }));
  }


}
