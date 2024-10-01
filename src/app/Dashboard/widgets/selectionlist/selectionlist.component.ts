import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ClientComponent } from '../../Components/clients/client/client.component';
import { MatDialog } from '@angular/material/dialog';
import { ClsParties} from '../../Classes/ClsParties';
import { DataService } from '../../Services/dataservice';
import { ClsItem } from '../../Classes/ClsItems';
import { ItemComponent } from '../../Components/items/item/item.component';
import { ClsUom } from '../../Classes/ClsUoms';
import { UomComponent } from '../../Components/uoms/uom/uom.component';
import { ClsLedger } from '../../Classes/ClsLedgers';
import { LedgerComponent } from '../../Components/Accounts/ledgers/ledger/ledger.component';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@Component({
  selector: 'app-selectionlist',
  templateUrl: './selectionlist.component.html',
  styleUrls: ['./selectionlist.component.scss']
})

@AutoUnsubscribe
export class SelectionlistComponent implements OnInit {
focus() {
//throw new Error('Method not implemented.');
} 
constructor(private dialog: MatDialog, private dataService: DataService){}
  
  showList: boolean = false;
  SelectionList: any [] = [];
  FilteredData: any [] = [];  
  activeIndex: number = 0; 
  
  focused: boolean = false;
  @ViewChild('InputBox') InputBox!: ElementRef;
    
  @Input() Caption!: string; // decorate the property with @Input()
  @Input() DataSource: any[] = []; // decorate the property with @Input()
  @Input() SelectedItem!: any; 
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() newMasterEmit = new EventEmitter<any>(); 
  
  @Input() MasterComponentId!: number;
  

  ngAfterViewInit(){
    
  }
  ngOnInit(): void { 
    //console.log (this.SelectedItem);
  }

  ngOnChanges(changes: SimpleChanges) {    
    this.SelectionList = this.DataSource;
    this.FilteredData = this.DataSource;         
}

OpenMaster()
{
  switch (this.MasterComponentId) {
    case 1:
      let pty = new ClsParties(this.dataService);                
      const dialogRef = this.dialog.open(ClientComponent, 
        {
          width:"45vw",
          height:"100vh",
          position:{"right":"0","top":"0" },
          data: pty.Initialize(),
        });      
        //dialogRef.disableClose = true; 
        dialogRef.afterClosed().subscribe(result => {                  
          if (result) 
          {             
              this.newMasterEmit.emit(result);            
          }        
        });
      break;    
    case 2:
        let it = new ClsItem(this.dataService);                
        const dialogRef1 = this.dialog.open(ItemComponent, 
          {            
            data: it.Initialize(),
          });      
          //dialogRef.disableClose = true; 
          dialogRef1.afterClosed().subscribe(result => {                    
            if (result) 
            {             
                this.newMasterEmit.emit(result);            
            }        
          });
        break;      
         
    case 4:
    let um = new ClsUom(this.dataService);                
    const dialogRef3 = this.dialog.open(UomComponent, 
      {            
        data: um.Initialize(),
      });      
      //dialogRef.disableClose = true; 
      dialogRef3.afterClosed().subscribe(result => {                     
        if (result) 
        {    
            this.newMasterEmit.emit(result);            
        }        
      });
    break; 

    case 5:
    let bnk = new ClsLedger(this.dataService);                
    const dialogRef4 = this.dialog.open(LedgerComponent, 
      {            
        data: bnk.Initialize(),
      });      
      //dialogRef.disableClose = true; 
      dialogRef4.afterClosed().subscribe(result => {                    
        if (result) 
        {             
            this.newMasterEmit.emit(result);            
        }        
      });
    break; 

    
  }
    
}

  DisplayList()
  {    
    this.showList = true;         
  }

  HideList()
  {   
    setTimeout(() => {
      this.showList = false;  
      this.activeIndex = 0;
    }, 200);    
  
  }

  FilterList($event: any)
  {    
    if ($event.key == "Escape") {
      this.HideList();
      return;
    }
    
    if ($event.key == "Enter")
    {
      this.SelectItem(this.activeIndex);
      this.HideList();
      return;
    }

    if ($event.key == "ArrowDown")
    { 
      this.DisplayList();
       if (this.activeIndex !=0) {document.getElementsByClassName('listItems')[this.activeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });}
      if (this.activeIndex < this.FilteredData.length-1) {this.activeIndex++;} 
    }
    else if ($event.key == "ArrowUp")
    {      
      this.DisplayList();      
      if (this.activeIndex !=0) {this.activeIndex--;}
      document.getElementsByClassName('listItems')[this.activeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      
    }
    else
    {
      this.DisplayList();
        let filterValue = ($event.target.value).toLowerCase();
        if (filterValue.trim() == "")
        {
          this.FilteredData = this.SelectionList;  
        }
        else
        {
          this.FilteredData = this.SelectionList.filter((cat) => cat.Name.toLowerCase().includes(filterValue));
          this.activeIndex = 0;
        }
    }
  } 

  SelectItem(ind: number){    
    this.SelectedItem = this.FilteredData[ind];    
    this.newItemEvent.emit(this.SelectedItem);
  }

  ClearItem(){            
    this.SelectedItem = {} as any;        
    this.activeIndex = 0;    
    this.FilteredData = this.SelectionList;  
    this.newItemEvent.emit(this.SelectedItem);
    this.HideList(); 
  }
  
  clickedOutside(){
    let boxvalue = (this.InputBox.nativeElement.value.trim()).toLowerCase();
    if (boxvalue == '')
    {
      this.ClearItem();
      this.showList = false;  
      this.activeIndex = 0;   
      return;
    }

    if (boxvalue !== '')
    {
      
      this.FilteredData = this.SelectionList.filter((cat) => cat.Name.toLowerCase() === boxvalue );      
      if ( this.FilteredData.length == 0 )
      {
        this.ClearItem();
        this.InputBox.nativeElement.value = "";
      }
    }
  }
}
