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
  selector: 'app-stockregister',
  templateUrl: './stockregister.component.html',
  styleUrls: ['./stockregister.component.scss']
}) 

export class StockregisterComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private router: Router){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  StockRegisterList!: TypeTransactions[];
  dataSource!: MatTableDataSource<TypeTransactions>;  
  columnsToDisplay: string[] = [ '#', 'Trans_Date', 'VouType_Name', 'Trans_No','Item_Name', 'Uom_Name', 'Karat_Name','Stock_In_Qty','Stock_In_GrossWt','Stock_In_NettWt','Stock_Out_Qty','Stock_Out_GrossWt','Stock_Out_NettWt'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadStockRegisterList();
  } 

  LoadStockRegisterList(){
    let itm = new ClsTransactions(this.dataService);    
    itm.getStockRegister().subscribe( data => {          
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.StockRegisterList = JSON.parse(data.apiData);                
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  }


  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeTransactions> (this.StockRegisterList);        
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
  
}
