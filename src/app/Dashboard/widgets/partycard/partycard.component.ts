import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ClsParties, TypeParties } from '../../Classes/ClsParties';
import { DataService } from '../../Services/dataservice';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { ImagesliderComponent } from 'src/app/GlobalWidgets/imageslider/imageslider.component';
import { MatDialog } from '@angular/material/dialog';

@AutoUnsubscribe
@Component({
  selector: 'app-partycard',
  templateUrl: './partycard.component.html',
  styleUrls: ['./partycard.component.scss']
})
export class PartycardComponent {
  constructor(private dataService: DataService, private dialog: MatDialog) {}
  PartyList!:      TypeParties[];
  PartyImages: any [] = [];

  @Input() PartyCat!: number;
  @Input() SelectedParty!: TypeParties;
  @Output() newPartyEvent = new EventEmitter<TypeParties>();
 
  ngOnInit(){
    this.LoadParties();    
  }

  ngOnChanges(changes: SimpleChanges){         
    if (changes['SelectedParty'].currentValue){
       this.SelectedParty = changes['SelectedParty'].currentValue;
    }    
  }
 
  LoadParties(){    
    let pty = new ClsParties(this.dataService);
    pty.getParties(0,this.PartyCat).subscribe(data => {      
      this.PartyList = JSON.parse (data.apiData);         
    });     
  }
  
  getParty($event: TypeParties){
    this.SelectedParty = $event;       
    this.newPartyEvent.emit(this.SelectedParty); 
    let  pty = new ClsParties(this.dataService);
    pty.getPartyImages(this.SelectedParty.PartySno).subscribe(data=>{
      this.PartyImages =  JSON.parse(data.apiData);      
    })
  }

  getNewMaster($event: TypeParties){    
    this.LoadParties();     
    this.SelectedParty = $event;
    this.newPartyEvent.emit(this.SelectedParty);
  }
  
  OpenSlider(){
    const dialogRef = this.dialog.open(ImagesliderComponent, 
      { 
        width:"50vw",        
        data: this.PartyImages , 
      });
      
      dialogRef.disableClose = true;      
  }
 
}
