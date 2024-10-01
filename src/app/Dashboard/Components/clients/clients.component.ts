import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../../Services/dataservice';
import { GlobalsService } from 'src/app/globals.service';
import { ClientComponent } from './client/client.component';
import { ClsParties, TypeParties } from '../../Classes/ClsParties';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {

  Party_Cat: number = 0;
  PartyCaption: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private globals: GlobalsService, private dialog: MatDialog )
  { }
  
  @ViewChild('TABLE')  table!: ElementRef;
 
  PartiesList!: TypeParties[];
  dataSource!: MatTableDataSource<TypeParties>;  
  columnsToDisplay: string[] = [ '#', 'Party_Code', 'Party_Name','City', 'Mobile','Email', 'crud'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  

  ngOnInit(){    
    this.LoadPartiesList();   
  } 

  LoadPartiesList(){
    let pty = new ClsParties(this.dataService);    
    pty.getParties(0,this.globals.PartyTypCustomers).subscribe(  data => {        
                     
      if (data.queryStatus == 0){
        this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);      
      }
      else{              

        this.PartiesList = JSON.parse (data.apiData);                     
        this.LoadDataIntoMatTable();
      }
    },
    error => {
      this.globals.ShowAlert(this.globals.DialogTypeError, error);      
    });
  }

  AddNewParty(){
    let pty = new ClsParties(this.dataService);        
    let rpty = pty.Initialize();    
    this.OpenParty(rpty);    
  }

  OpenParty(pty: TypeParties){        
    const dialogRef = this.dialog.open(ClientComponent, 
      {
        width:"45vw",
        height:"100vh",
        position:{"right":"0","top":"0" },
        data: pty,
      });      
      dialogRef.disableClose = true; 
      dialogRef.afterClosed().subscribe(result => {        
        
        if (result) 
        { 
          if (result == true)
          {
            this.LoadPartiesList();
          }          
        }        
      });      
  } 

  DeleteParty(party: TypeParties){
    this.globals.QuestionAlert("Are you sure you wanto to delete this Party?").subscribe(Response => {      
      if (Response == 1){
        let pty = new ClsParties(this.dataService);
        pty.Party = party;
        pty.deleteParty().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else
          {
            this.globals.SnackBar("info","Party deleted successfully",1500);
            const index =  this.PartiesList.indexOf(party);
            this.PartiesList.splice(index,1);
            this.LoadDataIntoMatTable();
          }
        })        
      }
    })
  }

  LoadDataIntoMatTable(){
    this.dataSource = new MatTableDataSource<TypeParties> (this.PartiesList);             
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
