
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from '../../Services/dataservice';
import { GlobalsService } from 'src/app/globals.service';
import { TypeTransactions } from '../../Classes/ClsTransactions';
import { ClsTransactions } from '../../Classes/ClsTransactions';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-pendingreport',
  templateUrl: './pendingreport.component.html',
  styleUrls: ['./pendingreport.component.scss']
}) 

export class PendingreportComponent {

  RepType: number = 0;
  RepTypeCaption: string = "";

  constructor(private dataService: DataService, private globals: GlobalsService, private router: Router, private activatedRoute: ActivatedRoute){
    this.activatedRoute.paramMap.subscribe(paramMap => {            
     this.RepType = +paramMap.get('type')!;
     this.LoadPendingReportList();
     switch (this.RepType) {
      case 1:
        this.RepTypeCaption = "Smeltings";   
        break;
      case 2:
        this.RepTypeCaption = "Refinings";   
        break;
      case 3:
        this.RepTypeCaption = "Castings";   
        break;      
      case 4:
      this.RepTypeCaption = "Delivery Docs";   
      break;      
    }    
 });
  }
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  PendingReportList!: TypeTransactions[];
  dataSource!: MatTableDataSource<TypeTransactions>;  
  columnsToDisplay: string[] = [ '#', 'Trans_No', 'Trans_Date', 'TotQty', 'TotGrossWt', 'TotNettWt', 'Due_Date'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  


  LoadPendingReportList(){
    let itm = new ClsTransactions(this.dataService);    
    itm.getPendingReport(this.RepType).subscribe( data => {              
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.PendingReportList = JSON.parse(data.apiData);                
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  }


  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeTransactions> (this.PendingReportList);        
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
