import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ItemComponent } from './item/item.component';
import { DataService } from '../../Services/dataservice';
import { GlobalsService } from 'src/app/globals.service';
import { TypeItem } from '../../Classes/ClsItems';
import { ClsItem } from '../../Classes/ClsItems';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
}) 
export class ItemsComponent {

  constructor(private dataService: DataService, private globals: GlobalsService, private dialog: MatDialog ){}
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  ItemsList!: TypeItem[];
  dataSource!: MatTableDataSource<TypeItem>;  
  columnsToDisplay: string[] = [ '#', 'Item_Code', 'Item_Name','crud'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){
    this.LoadItemList();
  } 

  LoadItemList(){
    let itm = new ClsItem(this.dataService);    
    itm.getItems(0).subscribe( data => {          
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              
        this.ItemsList = JSON.parse(data.apiData);                
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  }

  AddNewItem(){
    var itm = new ClsItem(this.dataService);    
    this.OpenItem(itm.Initialize());    
  }

  OpenItem(grp: TypeItem){        
    const dialogRef = this.dialog.open(ItemComponent, 
      {
        data: grp,
      });      
      dialogRef.disableClose = true; 
      dialogRef.afterClosed().subscribe(result => {        
        
        if (result) 
        { 
          if (result == true)
          {
            this.LoadItemList();
          }          
        }        
      });  
  } 

  DeleteItem(item: TypeItem){
    this.globals.QuestionAlert("Are you sure you wanto to delete this Item?").subscribe(Response => {      
      if (Response == 1){
        let grp = new ClsItem(this.dataService);
        grp.Item = item;
        grp.deleteItem().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info","Item deleted successfully",1500);
            const index =  this.ItemsList.indexOf(item);
            this.ItemsList.splice(index,1);
            this.LoadDataIntoMatTable();
          }
        })        
      }
    })
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeItem> (this.ItemsList);        
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
