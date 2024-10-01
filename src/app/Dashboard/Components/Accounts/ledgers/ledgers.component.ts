import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GlobalsService } from 'src/app/globals.service';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { ClsLedger, TypeLedger } from 'src/app/Dashboard/Classes/ClsLedgers';
import { LedgerComponent } from './ledger/ledger.component';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@Component({
  selector: 'app-ledgers',
  templateUrl: './ledgers.component.html',
  styleUrls: ['./ledgers.component.scss']
})

@AutoUnsubscribe
export class LedgersComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private dialog: MatDialog ){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  LedList!: TypeLedger[];
  dataSource!: MatTableDataSource<TypeLedger>;  
  columnsToDisplay: string[] = [ '#', 'Led_Name', 'Grp_Name', 'IsStd' ,'crud'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadLedgerList();
  }

  LoadLedgerList(){
    let grp = new ClsLedger(this.dataService);    
    grp.getLedgers(0,0).subscribe( data => {    
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.LedList = JSON.parse(data.apiData);
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  } 

  AddNewLedger(){
    var grp = new ClsLedger(this.dataService);    
    this.OpenLedger(grp.Initialize());    
  }

  OpenLedger(grp: TypeLedger){            
    const dialogRef = this.dialog.open(LedgerComponent, 
      {
        data: grp,
      });      
      dialogRef.disableClose = true; 
      dialogRef.afterClosed().subscribe(result => {        
        
        if (result) 
        { 
          if (result == true)
          {
            this.LoadLedgerList();
          }          
        }        
      });  
  } 

  DeleteLedger(Led: TypeLedger){
    this.globals.QuestionAlert("Are you sure you wanto to delete this Ledger?").subscribe(Response => {      
      if (Response == 1){
        let grp = new ClsLedger(this.dataService);
        grp.Ledger = Led;
        grp.deleteLedger().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info","Ledger deleted successfully",1500);
            const index =  this.LedList.indexOf(Led);
            this.LedList.splice(index,1);
            this.LoadDataIntoMatTable();
          }
        })        
      }
    })
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeLedger> (this.LedList);       
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
