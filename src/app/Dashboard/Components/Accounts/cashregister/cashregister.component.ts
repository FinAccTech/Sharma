import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GlobalsService } from 'src/app/globals.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { ClsVoucher } from 'src/app/Dashboard/Classes/ClsVouchers';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { AuthService } from 'src/app/Auth/auth.service';


@Component({
  selector: 'app-cashregister',
  templateUrl: './cashregister.component.html',
  styleUrls: ['./cashregister.component.scss']
}) 
@AutoUnsubscribe
export class CashregisterComponent {

  Vou_Date: number = 0;
  OpenBalance: number = 0;
  CloseBalance: number = 0;

  constructor(private dataService: DataService, private globals: GlobalsService, private router: Router, private auth: AuthService){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  CashRegisterList!: any[];
  dataSource!: MatTableDataSource<any>;  
  columnsToDisplay: string[] = [ '#', 'Vou_No', 'VouDate', 'Series_Name', 'Led_Name', 'Debit', 'Credit'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.Vou_Date  = this.globals.DateToInt(new Date());
    this.LoadCashRegisterList(this.globals.DateToInt(new Date()));
  } 
 
  LoadCashRegisterList(VouDate: number){
    let itm = new ClsVoucher(this.dataService);    
    itm.getCashRegister(this.auth.SelectedCompSno,VouDate).subscribe( data => {          
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.CashRegisterList = JSON.parse(data.apiData);                
         this.OpenBalance = data.OpenBalance;         
         this.CloseBalance =  data.CloseBalance;
        
        
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  }

  LoadVouchers(){
    console.log(this.Vou_Date);
    
    this.LoadCashRegisterList(this.Vou_Date);
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<any> (this.CashRegisterList);        
    if (this.dataSource.filteredData)
    { 
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);      
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  DateToInt($event: any): number{        
    return this.globals.DateToInt( new Date ($event.target.value));
  }
  
  
}
