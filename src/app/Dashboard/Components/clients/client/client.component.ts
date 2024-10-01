import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ClsParties, TypeParties } from 'src/app/Dashboard/Classes/ClsParties';
import { DataService } from 'src/app/Dashboard/Services/dataservice'; 
import { ProgressbroadcastService } from 'src/app/Dashboard/Services/progressbroadcast.service';
import { FileHandle } from 'src/app/Dashboard/Types/file-handle';
import { ImagesComponent } from 'src/app/Dashboard/widgets/images/images.component';
import { WebcamComponent } from 'src/app/GlobalWidgets/webcam/webcam.component';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';
import { GlobalsService } from 'src/app/globals.service';

@AutoUnsubscribe
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})

export class ClientComponent implements OnInit {
  
  
  Party!:         TypeParties;    
  DataChanged:    boolean = false;
    
  TransImages: FileHandle[] = [];

  // For Validations  
  PartyNameValid: boolean = true;
  MobNumberValid: boolean = true;
  
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ClientComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TypeParties,    
    private dataService: DataService,    
    private globals: GlobalsService,
    private progressService: ProgressbroadcastService
  ) 
  {
    this.Party = data;          
  } 

  ngOnInit(): void {                        
    if (this.Party.PartySno == 0)
      {
        // const fileHandle: FileHandle ={
        //   Image_Name: "",
        //   Image_File: null!, 
        //   Image_Url: '',
        //   SrcType:1, 
        //   DelStatus:0,
        //   Favorite:false
        // };          
        // this.TransImages[0] = (fileHandle);      
      }
    else{
      let pty = new ClsParties(this.dataService);
      pty.getPartyImages(this.Party.PartySno).subscribe(data =>{        
        this.TransImages = JSON.parse (data.apiData);  
        this.Party.fileSource =  JSON.parse (data.apiData);              
      })
    }
  }

  SaveParty(){            

    if (this.ValidateInputs() == false) {return};    
    
    var StrImageXml: string = "";

    StrImageXml = "<ROOT>"
    StrImageXml += "<Images>"
    
    for (var i=0; i < this.TransImages.length; i++)
    {
      if (this.TransImages[i].DelStatus == 0)
      {
        StrImageXml += "<Image_Details ";
        StrImageXml += " Image_Name='" + this.TransImages[i].Image_Name + "' ";                 
        StrImageXml += " Image_Url='" + this.TransImages[i].Image_Name + "' ";             
        StrImageXml += " >";
        StrImageXml += "</Image_Details>";
      }      
    }   

    StrImageXml += "</Images>" 
    StrImageXml += "</ROOT>"

    
    let pty = new ClsParties(this.dataService);
    pty.Party = this.Party;    
    pty.Party.Party_Cat = this.globals.PartyTypCustomers;
    pty.Party.ImageDetailXML = StrImageXml;
    pty.Party.fileSource = this.TransImages;
    pty.Party.Name = pty.Party.Party_Name;
    pty.Party.Details = pty.Party.Mobile;
    
    if (pty.Party.TempImage){
      pty.Party.TempImage = this.TransImages[0].Image_File;
    }
    

    this.progressService.sendUpdate("start","Saving Party");
    pty.saveParty().subscribe(data => {            
      this.progressService.sendUpdate("stop","");

        if (data.queryStatus == 0) {
          this.globals.ShowAlert(this.globals.DialogTypeError,data.apiData);
          return;
        }
        else{          
          pty.Party.PartySno = data.RetSno;
          this.globals.SnackBar("info", this.Party.PartySno == 0 ? "Party Created successfully" : "Party updated successfully",1500);
          this.DataChanged = true;
          this.CloseDialog(pty.Party);
        }
    },  
    error => {
      this.progressService.sendUpdate("stop","");
      this.globals.ShowAlert(this.globals.DialogTypeError, error);
    }
    )
  }

  DeleteParty(){
    if (this.Party.PartySno == 0){
      this.globals.SnackBar("error", "No Party selected to delete",1500);
      return;
    }
    this.globals.QuestionAlert("Are you sure you wanto to delete this Party?").subscribe(Response => {      
      if (Response == 1){
        let ar = new ClsParties(this.dataService);
        ar.Party = this.Party;
        ar.deleteParty().subscribe(data => {
          if (data.queryStatus == 0)
          {
            this.globals.ShowAlert(this.globals.DialogTypeError, data.apiData);
            return;
          }
          else{
            this.globals.SnackBar("info", "Party deleted successfully",1500);
            this.DataChanged = true;
            this.CloseDialog(this.Party);
          }
        })        
      }
    })
  }

  CloseDialog(pty: TypeParties)  {
    this.dialogRef.close(pty); 
  }

  DateToInt($event: any): number{        
    return this.globals.DateToInt( new Date ($event.target.value));
  }

  ValidateInputs(): boolean{           
    if (!this.Party.Party_Name!.length )  { this.PartyNameValid = false;  return false; }  else  {this.PartyNameValid = true; }        
    // if (!this.Party.Mobile || this.Party.Mobile!.length < 10)  { this.MobNumberValid = false;  return false; }  else  {this.MobNumberValid = true; }        
    return true;
  }
  
  OpenImagesCreation(){
    var img = this.TransImages; 

    const dialogRef = this.dialog.open(ImagesComponent, 
      { 
        width:"50vw",
        height:"60vh",        
        data: {img}, 
      });
      
      dialogRef.disableClose = true;

      dialogRef.afterClosed().subscribe(result => {
        if (result){
          this.TransImages = result;
        }
        
        // this.urls = [];
        // this.urls.push  (result);     
        // console.log (this.urls);
        //this.imagesCount = result.length;   
      }); 
  }

  
  selectFile($event: any)
  { 
    if ($event.target.files)
    {      
        const file = $event?.target.files[0];        
        var reader = new FileReader();
        reader.readAsDataURL($event.target.files[0]);
        reader.onload = (event: any) => {
          const fileHandle: FileHandle ={
            Image_Name: file.name,
            Image_File: event.target.result, 
            Favorite: false,
            Image_Url: this.sanitizer.bypassSecurityTrustUrl(
              window.URL.createObjectURL(file),              
            ),
            SrcType:0,
            DelStatus:0
          };          
          this.TransImages[0] = (fileHandle);    
        }
      
    }    
    
  }

  RemoveProfileImage(){  
    this.TransImages[0].Image_File = null!;
    this.TransImages[0].Image_Url = "";
    this.TransImages[0].SrcType = 2;
    this.TransImages.splice(0,1);    
  }
  
  OpenWebCam(){        
    const dialogRef = this.dialog.open(WebcamComponent, 
      {
        // width:"45vw",
        // height:"100vh",
        // position:{"right":"0","top":"0" },
        data: "",
      });      
      dialogRef.disableClose = true; 
      dialogRef.afterClosed().subscribe(result => {        
        
        if (result) 
        { 
            this.TransImages = result;
        }        
      });      
  } 
}
