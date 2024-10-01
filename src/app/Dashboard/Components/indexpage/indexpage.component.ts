import { Component } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/auto-unsubscribe.decorator';

@Component({
  selector: 'app-indexpage',
  templateUrl: './indexpage.component.html',
  styleUrls: ['./indexpage.component.scss']
})

@AutoUnsubscribe
export class IndexpageComponent {

  ngOnInit(){
    
  }

}
