import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-imageslider',
  templateUrl: './imageslider.component.html',
  styleUrls: ['./imageslider.component.scss']
})
export class ImagesliderComponent {

  imageObject: Array<object> = [];
  constructor(public dialogRef: MatDialogRef<ImagesliderComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any[],){}

  ngOnInit(){
    this.data.forEach(img=>{
      this.imageObject.push({image: img.Image_Url, thumbImage: img.Image_Url})
    });      
  }
}
