import { Component, Inject, OnInit, Input,Output, EventEmitter  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-pop-up-dashboard',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class PopUpDashboardComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data,
  private matDialog : MatDialog){}
  @Output() isOpacity = new EventEmitter<boolean>();


  ngOnInit(): void {
    
  }

  addNewItem(value: boolean) {
    this.isOpacity.emit(value);
  }

  skip(){
    // document.querySelector('#dashboard-wrapper-id').classList.remove('blur');
    console.log('skip pressed')
    this.matDialog.closeAll()
  }

  previous(){
    // document.querySelector('#container-lend').classList.remove('blur');
    console.log('previous pressed')
    this.matDialog.closeAll()
  }

  next(){
    document.querySelector('#dashboard-wrapper-id').classList.remove('blur');
    console.log('next pressed')
    this.matDialog.closeAll()
  }
}