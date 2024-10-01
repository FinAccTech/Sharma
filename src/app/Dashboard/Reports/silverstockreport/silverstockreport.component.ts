import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from '../../Services/dataservice';
import { GlobalsService } from 'src/app/globals.service';
import { TypeTransactions } from '../../Classes/ClsTransactions';
import { ClsTransactions } from '../../Classes/ClsTransactions';
import { Router } from '@angular/router';


@Component({
  selector: 'app-silverstockreport',
  templateUrl: './silverstockreport.component.html',
  styleUrls: ['./silverstockreport.component.scss']
}) 

export class SilverstockreportComponent {
  totlist: any;

  constructor(private dataService: DataService, private globals: GlobalsService, private router: Router){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  StockReportList!: TypeTransactions[];
  dataSource!: MatTableDataSource<TypeTransactions>;  
  columnsToDisplay: string[] = [ '#', 'Item_Name', 'Uom_Name', 'Karat', 'StockQty', 'StockGrossWt', 'StockNettWt', 'StockPureWt'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadStockReportList();
  } 

  LoadStockReportList(){
    let itm = new ClsTransactions(this.dataService);    
    itm.getStockReport(2).subscribe( data => {          
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.StockReportList = JSON.parse(data.apiData);                
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  }


  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeTransactions> (this.StockReportList);        
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

  GrossWtTotal()
  {    
    this.totlist = this.StockReportList;
    return this.totlist.map((t: { StockGrossWt: any; }) => t.StockGrossWt!).reduce((acc: any, value: any) => +acc + +value, 0);
  }

  NettWtTotal()
  {    
    this.totlist = this.StockReportList;
    return this.totlist.map((t: { StockNettWt: any; }) => t.StockNettWt!).reduce((acc: any, value: any) => +acc + +value, 0);
  }

  PureWtTotal()
  {    
    this.totlist = this.StockReportList;
    return this.totlist.map((t: { StockPureWt: any; }) => t.StockPureWt!).reduce((acc: any, value: any) => +acc + +value, 0);
  }
}
