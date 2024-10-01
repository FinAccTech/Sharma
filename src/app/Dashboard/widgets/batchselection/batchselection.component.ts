import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TypeBatchBills } from '../../Types/TypeBatchBills';

@Component({
  selector: 'app-batchselection',
  templateUrl: './batchselection.component.html',
  styleUrls: ['./batchselection.component.scss']
})
export class BatchselectionComponent {

  constructor(public dialogRef: MatDialogRef<BatchselectionComponent>,
    @Inject(MAT_DIALOG_DATA) public batchData: TypeBatchBills[],        
    public dialog: MatDialog){}

    ngOnInit(){
      console.log (this.batchData);
    }

    UpdateSelection(item: TypeBatchBills, $event:any){      
      item.Selected = $event.checked;
    }

    UpdateValues(){      
      this.dialogRef.close(this.batchData);
    }
}
