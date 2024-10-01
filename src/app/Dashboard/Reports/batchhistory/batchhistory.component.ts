import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from '../../Services/dataservice';
import { GlobalsService } from 'src/app/globals.service';
import { ClsTransactions } from '../../Classes/ClsTransactions';
import { Router } from '@angular/router';
import { TypeBatch } from '../../Types/TypeBatch';


@Component({
  selector: 'app-batchhistory',
  templateUrl: './batchhistory.component.html',
  styleUrls: ['./batchhistory.component.scss']
}) 

export class BatchhistoryComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private router: Router){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  BatchList!: TypeBatch[];
  SelectedBatch!: TypeBatch;
  BatchHistory!: any[];
  dataSource!: MatTableDataSource<any>;  
  columnsToDisplay: string[] = [ '#', 'VouType_Name', 'Trans_No', 'Trans_Date', 'Party_Name'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    let trans = new ClsTransactions(this.dataService);
    trans.getBatchList().subscribe(data =>{
      console.log (data)
      this.BatchList = JSON.parse (data.apiData);
    });
  } 

  LoadBatchHistory(){
    let itm = new ClsTransactions(this.dataService);    
    itm.getBatchHistory(this.SelectedBatch.BatchSno).subscribe( data => {          
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.BatchHistory = JSON.parse(data.apiData);                
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  }


  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<any> (this.BatchHistory);        
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

  getBatch($event: TypeBatch){     
    this.SelectedBatch = $event;        
    this.LoadBatchHistory();
  }
  
}
