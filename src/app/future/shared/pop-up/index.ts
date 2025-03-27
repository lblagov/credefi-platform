import { Component, Inject, OnInit, Input,Output, EventEmitter  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class PopUpComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data,
  private matDialog : MatDialog){}
  // @Input() isOpacity;
  @Output() isOpacity = new EventEmitter<boolean>();


  ngOnInit(): void {
    
  }

  addNewItem(value: boolean) {
    this.isOpacity.emit(value);
    // console.log(this.isOpacity)
  }

  confirm(){
    document.querySelector('#container-lend').classList.remove('blur');
    console.log('confirm pressed')
    this.matDialog.closeAll()
  }
}
