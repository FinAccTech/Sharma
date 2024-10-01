import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GlobalsService } from 'src/app/globals.service';
import { DataService } from 'src/app/Dashboard/Services/dataservice';
import { ClsLGrp, TypeLGrp } from 'src/app/Dashboard/Classes/ClsLedger_Groups';
import { LedgergroupComponent } from './ledgergroup/ledgergroup.component';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@Component({
  selector: 'app-ledgergroups',
  templateUrl: './ledgergroups.component.html',
  styleUrls: ['./ledgergroups.component.scss']
})
@AutoUnsubscribe
export class LedgergroupsComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private dialog: MatDialog ){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  LGrpList!: TypeLGrp[];
  dataSource!: MatTableDataSource<TypeLGrp>;  
  columnsToDisplay: string[] = [ '#', 'Grp_Name', 'IsStd' ,'crud'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadLGrpList();
  }

  LoadLGrpList(){
    let grp = new ClsLGrp(this.dataService);    
    grp.getLGrps(0).subscribe( data => {    
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.LGrpList = JSON.parse(data.apiData);
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  } 

  AddNewLGrp(){
    var grp = new ClsLGrp(this.dataService);    
    this.OpenLGrp(grp.Initialize());    
  }

  OpenLGrp(grp: TypeLGrp){            
    const dialogRef = this.dialog.open(LedgergroupComponent, 
      {
        data: grp,
      });      
      dialogRef.disableClose = true; 
      dialogRef.afterClosed().subscribe(result => {        
        
        if (result) 
        { 
          if (result == true)
          {
            this.LoadLGrpList();
          }          
        }        
      });  
  } 

  DeleteLGrp(LGrp: TypeLGrp){
    this.globals.QuestionAlert("Are you sure you wanto to delete this LGrp?").subscribe(Response => {      
      if (Response == 1){
        let grp = new ClsLGrp(this.dataService);
        grp.LGrp = LGrp;
        grp.deleteLGrp().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info","LGrp deleted successfully",1500);
            const index =  this.LGrpList.indexOf(LGrp);
            this.LGrpList.splice(index,1);
            this.LoadDataIntoMatTable();
          }
        })        
      }
    })
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeLGrp> (this.LGrpList);       
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
