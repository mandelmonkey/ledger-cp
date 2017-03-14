import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(private dataService:DataService){


  }


  public setJapanese(){
   this.dataService.setJapanese();
  }
  public setEnglish(){
    this.dataService.setEnglish();
  }

  ngOnInit() {
  }

}
