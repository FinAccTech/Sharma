import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from '../../Services/dataservice';
import { GlobalsService } from 'src/app/globals.service';
import { TypeTransactions } from '../../Classes/ClsTransactions';
import { ClsTransactions } from '../../Classes/ClsTransactions';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from '../../../auto-unsubscribe.decorator';
import { ProgressbroadcastService } from '../../Services/progressbroadcast.service';

@Component({
  selector: 'app-jobworkinwards',
  templateUrl: './jobworkinwards.component.html',
  styleUrls: ['./jobworkinwards.component.scss']
}) 

@AutoUnsubscribe
export class JobworkinwardsComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private router: Router, private progressService: ProgressbroadcastService){}
  
  @ViewChild('TABLE')  table!: ElementRef;
  FromDate: number = 0;
  ToDate: number = 0;

  JobworkInwardsList!: TypeTransactions[];
  dataSource!: MatTableDataSource<TypeTransactions>;  
  columnsToDisplay: string[] = [ '#', 'Trans_No', 'Trans_Date', 'Party_Name', 'TotNettWt', 'NettAmt', 'TransStatus', 'crud'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadJobworkInwardList(999,999);
  } 

  LoadJobworkInwardList(FromDate: number, ToDate: number){
    let itm = new ClsTransactions(this.dataService);    
    this.progressService.sendUpdate("start","Loading Jobwork Inwards...");
    itm.getTransactions(0, this.globals.VTypJobworkInward,0, FromDate, ToDate).subscribe( data => {       
      this.progressService.sendUpdate("stop","");   
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.JobworkInwardsList = JSON.parse(data.apiData);                
        this.LoadDataIntoMatTable();
        if (FromDate === 999 || ToDate === 999){ this.FromDate = data.ExtraData; this.ToDate = data.ExtraData;}
      }
    },
    error => {
      this.progressService.sendUpdate("stop","");
      this.globals.ShowAlert(this.globals.DialogTypeError, "Network Connection error!! Retry or Try Refreshing the Browser. "); 
    });
  }

  FilterByDate(){
    this.LoadJobworkInwardList(this.FromDate, this.ToDate) 
  }

  AddNewTransaction(){
    var trans = new ClsTransactions(this.dataService);    
    this.OpenTransaction(trans.Initialize());     
  }

  OpenTransaction(trans: TypeTransactions){            
    trans.VouTypeSno = this.globals.VTypJobworkInward;        
    this.router.navigate(['dashboard/jobworkinward', JSON.stringify(trans)]);
  } 

  PrintTransaction(trans: TypeTransactions){    
    let Trans = new ClsTransactions(this.dataService);
    Trans.getLockStatus(trans.TransSno).subscribe(data =>{
      if (data.apiData == 1){
        this.globals.ShowAlert(3,"This Document is already printed and Locked..");
        return;        
      }
      else{
        trans.Series = JSON.parse(trans.Series_Json!)[0];
        trans.Party = JSON.parse(trans.Party_Json!)[0];    
        Trans.UpdateLockStatus(trans.TransSno).subscribe(data =>{
          if (data.apiData == 1){
            this.globals.PrintVoucher(trans,[]);    
          }          
          else{
            this.globals.ShowAlert(3,"Error updating the Transaction..");
        return;        
          }
        })        
      }
    });    
    
  }

  DeleteItem(trans: TypeTransactions){
    this.globals.QuestionAlert("Are you sure you wanto to delete this Inward?").subscribe(Response => {      
      if (Response == 1){
        let grp = new ClsTransactions(this.dataService);
        grp.Trans = trans;
        grp.deleteTransaction().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info","Jobwork Inward deleted successfully",1500);
            const index =  this.JobworkInwardsList.indexOf(trans);
            this.JobworkInwardsList.splice(index,1);
            this.LoadDataIntoMatTable();
          }
        })        
      }
    })
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeTransactions> (this.JobworkInwardsList);        
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


