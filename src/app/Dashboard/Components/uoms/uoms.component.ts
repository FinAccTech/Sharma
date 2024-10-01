import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UomComponent } from './uom/uom.component';
import { DataService } from '../../Services/dataservice';
import { GlobalsService } from 'src/app/globals.service';
import { ClsUom, TypeUom } from '../../Classes/ClsUoms';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-uoms',
  templateUrl: './uoms.component.html',
  styleUrls: ['./uoms.component.scss']
})
export class UomsComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private dialog: MatDialog ){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  UomList!: TypeUom[];
  dataSource!: MatTableDataSource<TypeUom>;  
  columnsToDisplay: string[] = [ '#', 'Uom_Code', 'Uom_Name', 'Active_Status' ,'crud'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadUomList();
  }

  LoadUomList(){
    let grp = new ClsUom(this.dataService);    
    grp.getUoms(0).subscribe( data => {    
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.UomList = JSON.parse(data.apiData);
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  } 

  AddNewUom(){
    var grp = new ClsUom(this.dataService);    
    this.OpenUom(grp.Initialize());    
  }

  OpenUom(grp: TypeUom){            
    const dialogRef = this.dialog.open(UomComponent, 
      {
        data: grp,
      });      
      dialogRef.disableClose = true; 
      dialogRef.afterClosed().subscribe(result => {        
        
        if (result) 
        { 
          if (result == true)
          {
            this.LoadUomList();
          }          
        }        
      });  
  } 

  DeleteUom(Uom: TypeUom){
    this.globals.QuestionAlert("Are you sure you wanto to delete this Uom?").subscribe(Response => {      
      if (Response == 1){
        let grp = new ClsUom(this.dataService);
        grp.Uom = Uom;
        grp.deleteUom().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info","Uom deleted successfully",1500);
            const index =  this.UomList.indexOf(Uom);
            this.UomList.splice(index,1);
            this.LoadDataIntoMatTable();
          }
        })        
      }
    })
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeUom> (this.UomList);       
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
